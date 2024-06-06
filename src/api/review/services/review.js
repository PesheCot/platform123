'use strict';

/**
 * review service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const myHelper = require('../../../../helpers/websocket.js')

module.exports = createCoreService('api::review.review', ({ strapi }) => ({
    async postTask(id, user, ctx) { 
        const req = ctx.request.body;
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { students: user },
            populate: ['teacher'],
        });
        if (group.length > 0) {
            const task = await strapi.entityService.findMany('api::review.review', {
                filters: { user_id: user.id, teacher_id: group[0].teacher.id, task_id: req.task_id, lesson_id: id },
            });
            const edior_checks = await strapi.entityService.findMany('api::lesson.lesson', {
                filters: { id: id },
                populate: ['tasks']
            });
            const result = edior_checks[0].tasks.filter(edior_check => edior_check.id == req.task_id);
            if (task.length > 0) {
                if (task[0].try > 0) {
                    const entry = await strapi.entityService.update('api::review.review', task[0].id, {
                        data: {
                            user_id: user.id,
                            teacher_id: group[0].teacher.id,
                            task_id: req.task_id,
                            lesson_id: id,
                            is_editor: result[0].is_editor,
                            html: req.html,
                            css: req.css,
                            js: req.js,
                            is_sent: req.is_sent,
                            publishedAt: null,
                        },
                    });
                    return entry;
                } else {
                    return { 
                        error: {
                            status: 403,
                            name: "AlreadySent",
                            message: "You used all tries"
                        } 
                    }
                }
            } else {
                const entry = await strapi.entityService.create('api::review.review', {
                    data: {
                        user_id: user.id,
                        teacher_id: group[0].teacher.id,
                        task_id: req.task_id,
                        lesson_id: id,
                        is_editor: result[0].is_editor,
                        html: req.html,
                        css: req.css,
                        js: req.js,
                        try: 3,
                        is_sent: req.is_sent,
                        publishedAt: null,
                    },
                });
                return entry;
            }   
        } else {
            return {
                error: {
                    status: 404,
                    name: "NotFound",
                    message: "Cannot find group"
                }
            };
        }

    },
    async getTasks(user, ctx) {
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { teacher: user.id },
            populate: ['teacher'],
        });
        if (group.length > 0) {
            const tasks = await strapi.entityService.findMany('api::review.review', {
                filters: { teacher_id: group[0].teacher, mark: null },
                populate: ['lesson_id','user_id'],
            });
            for (const task of tasks) {
                let lesson = await strapi.entityService.findMany('api::lesson.lesson', {
                    filters: { id: task.lesson_id.id },
                    populate: ['tasks']
                });
                const result = lesson[0].tasks.filter(lesson_task => lesson_task.id == task.task_id);
                task.task_name = result[0]?.name
                task.task_user_id = task.user_id.id
                task.fio = task.user_id.name + ' ' + task.user_id.last_name + ' ' + task.user_id.patronymic
            }

            if (tasks.length > 0) {
                return tasks;
            } else {
                return {
                    error: {
                        status: 403,
                        name: "NotAllowed",
                        message: "Cannot find tasks"
                    }
                };
            }
        } else {
            return {
                error: {
                    status: 404,
                    name: "NotFound",
                    message: "Cannot find group"
                }
            };
        }
    },
    async getTask(user, ctx, taskId, lessonId, studentId) {
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { teacher: user.id },
            populate: ['teacher'],
        });
        const lesson = await strapi.entityService.findMany('api::lesson.lesson', {
            filters: { id: lessonId },
            populate: ['tasks']
        });
        const student = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: { id: studentId },
        });
        if (group.length > 0 && lesson.length > 0 && student.length > 0) {
            const lesson_tasks = lesson[0].tasks
            delete lesson[0].tasks
            const tasks = await strapi.entityService.findMany('api::review.review', {
                filters: { teacher_id: group[0].teacher, task_id: taskId, lesson_id: lesson[0], user_id: student[0] },
                populate: {
                    comments: {
                        fields: ['id', 'text'],
                        populate: {
                            comment_user_id: {
                                fields: ['id']
                            }
                        }
                    }
                }
            });

            for(let i = 0; i < tasks[0].comments.length; i++) {
                const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
                    filters: { id: tasks[0].comments[i].comment_user_id.id },
                })
                tasks[0].comments[i].name = user[0].name
            };

            if (tasks.length > 0) {
                const result = lesson_tasks.filter(lesson_task => lesson_task.id == tasks[0].task_id);
                tasks[0].name = result[0].name
                tasks[0].text = result[0].text
                tasks[0].lesson_to_front = lesson
                return tasks[0];
            } else {
                return {
                    error: {
                        status: 404,
                        name: "NotFound",
                        message: "Cannot find task"
                    }
                };
            }
        } else {
            return {
                error: {
                    status: 404,
                    name: "NotFound",
                    message: "Cannot find full data"
                }
            };
        }
    },
    async putMark(user, ctx, taskId, lessonId, studentId) {
        const mark = ctx.request.body.mark;
        if (mark <= 5 && mark >= 1) {
            const group = await strapi.entityService.findMany('api::group.group', {
                filters: { teacher: user.id },
                populate: ['teacher'],
            });
            const lesson = await strapi.entityService.findMany('api::lesson.lesson', {
                filters: { id: lessonId },
                populate: ['tasks']
            });
            const student = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { id: studentId },
            });
            if (group.length > 0 && lesson.length > 0 && student.length > 0) {
                delete lesson[0].tasks
                const tasks = await strapi.entityService.findMany('api::review.review', {
                    filters: { teacher_id: group[0].teacher, task_id: taskId, lesson_id: lesson[0], user_id: student[0] },
                });

                if (tasks.length > 0) {
                    let publishedAt = null;
                    const currentDate = new Date().toISOString();
                    publishedAt = currentDate;
                    const entry = await strapi.entityService.update('api::review.review', tasks[0].id, {
                        data: {
                            mark: mark,
                            try: tasks[0].try - 1,
                            is_sent: null,
                            teacher_comment: ctx.request.body.comment,
                            publishedAt: publishedAt
                        },
                    });

                    user.message = 'Вы поставили оценку ' + mark + ' на урок ' + lesson[0].name;
                    user.link = '/review/' + taskId + '/' + lessonId + '/' + studentId;
                    await myHelper.socket(user);
                    student[0].message = 'Вам поставили оценку ' + mark + ' на урок ' + lesson[0].name;
                    student[0].link = '/lessons/' + lesson[0].slug;
                    await myHelper.socket(student[0]);
                    
                    return entry;
                } else {
                    return {
                        error: {
                            status: 404,
                            name: "NotFound",
                            message: "Cannot find task"
                        }
                    };
                }
            } else {
                return {
                    error: {
                        status: 404,
                        name: "NotFound",
                        message: "Cannot find full data"
                    }
                };
            }
        } else 
        return {
            error: {
                status: 401,
                name: "WrongMark",
                message: "Mark must be between 1 and 5"
            }
        };
    },

    async createComment(user, ctx, taskId, lessonId, studentId) {
  
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { teacher: user.id },
            populate: ['teacher'],
        });
        const lesson = await strapi.entityService.findMany('api::lesson.lesson', {
            filters: { id: lessonId },
            populate: ['tasks']
        });
        const student = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: { id: studentId },
        });

        if (group.length > 0 && lesson.length > 0 && student.length > 0) {
            delete lesson[0].tasks
            const tasks = await strapi.entityService.findMany('api::review.review', {
                filters: { teacher_id: group[0].teacher, task_id: taskId, lesson_id: lesson[0], user_id: student[0] },
                populate: {
                    comments: {
                        fields: ['id', 'text'],
                        populate: {
                            comment_user_id: {
                                fields: ['id']
                            }
                        }
                    }
                }
            });

            if (ctx.request.body.text) { 
                const comments = tasks[0].comments;
                comments.push(
                    {
                        text: ctx.request.body.text,
                        comment_user_id: {
                            id: user.id
                        }
                    }
                )

                const create_comment = await strapi.entityService.update('api::review.review', tasks[0].id, {
                    data: {
                        comments: comments
                    }
                });
                return create_comment;
            }

        } else {
            return {
                error: {
                    status: 404,
                    name: "NotFound",
                    message: "Cannot find full data"
                }
            };
        }
        
    },

    async getTaskForStudent(user, ctx, taskId, lessonId, studentId) {
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { students: user },
            populate: ['teacher'],
        });
        const lesson = await strapi.entityService.findMany('api::lesson.lesson', {
            filters: { id: lessonId },
            populate: ['tasks']
        });
        const student = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: { id: studentId },
        });

        if (group.length > 0 && lesson.length > 0 && student.length > 0) {
            const lesson_tasks = lesson[0].tasks
            delete lesson[0].tasks
            const tasks = await strapi.entityService.findMany('api::review.review', {
                filters: { teacher_id: group[0].teacher, task_id: taskId, lesson_id: lesson[0], user_id: student[0] },
                populate: {
                    comments: {
                        fields: ['id', 'text'],
                        populate: {
                            comment_user_id: {
                                fields: ['id']
                            }
                        }
                    }
                }
            });

            for(let i = 0; i < tasks[0].comments.length; i++) {
                const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
                    filters: { id: tasks[0].comments[i].comment_user_id.id },
                })
                tasks[0].comments[i].name = user[0].name
            };

            if (tasks.length > 0) {
                const result = lesson_tasks.filter(lesson_task => lesson_task.id == tasks[0].task_id);
                tasks[0].name = result[0].name
                tasks[0].text = result[0].text
                tasks[0].data_parse = Date.parse(tasks[0].updatedAt)
                tasks[0].lesson_to_front = lesson
                
                return tasks[0];
            } else {
                return {
                    error: {
                        status: 404,
                        name: "NotFound",
                        message: "Cannot find task"
                    }
                };
            }
        } else {
            return {
                error: {
                    status: 404,
                    name: "NotFound",
                    message: "Cannot find full data"
                }
            };
        }
    },
    }));