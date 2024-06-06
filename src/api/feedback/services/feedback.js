'use strict';

/**
 * feedback service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const myHelper = require('../../../../helpers/websocket.js')

module.exports = createCoreService('api::feedback.feedback', ({ strapi }) => ({
    //Пользователь создаёт вопрос
async userQuestion(user, ctx) { 
        const entry = await strapi.entityService.create('api::feedback.feedback', {
            data: {
                user_id: user.id,
                title: ctx.request.body.title,
                question: ctx.request.body.question
            },
        });

        user.message = 'Вы задали вопрос ' + ctx.request.body.title;
        user.link = '/help/' + entry.id;
        await myHelper.socket(user);
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { students: user.id },
            populate: ['teacher']
        });
        if (user.role.name != 'Teacher') {
            let teacher = group[0].teacher;
            teacher.message = user.name + ' ' + user.last_name + ' ' + user.patronymic + ' задал(а) вопрос ' + ctx.request.body.title;
            teacher.link = '/help/' + entry.id;
            await myHelper.socket(teacher);
        }

        return entry;  
},
//Создание комментария 
async createComment(user, ctx, id) {
    if (user.role.name == 'Teacher') {
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { teacher: user.id },
            populate: ['students']
        });
        let questions = [];
        for(let i = 0; i < group[0].students.length; i++) {
           const students = await strapi.entityService.findMany('api::feedback.feedback', {
            filters: { user_id: group[0].students[i], id: id }, 
            populate: {
                user_id: {},
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
        
        students.forEach(elem => {
            questions.push(elem);
        });
        }
     
        if(questions.length <= 0)
        {
            questions = await strapi.entityService.findMany('api::feedback.feedback', {
                filters: { user_id: user.id, id: id },
                populate: {comments: {
                    fields: ['id', 'text'],
                }}
            });
            if (questions.length <= 0) {
                return {
                    error: {
                        status: 404,
                        name: "NotFound",
                        message: "Cannot find question"
                    }
                };
            }

        }

        const comments = questions[0].comments;

        comments.push(
            {
                text: ctx.request.body.text,
                comment_user_id: {
                    id: user.id
                }
            }
        )
        const question = await strapi.entityService.update('api::feedback.feedback', id, {
            data: {
                comments: comments
            }
        });

        if (questions[0].user_id) {
            if (questions[0].user_id.id != user.id) {
                let stud = questions[0].user_id;
                stud.message = user.name + ' ' + user.last_name + ' ' + user.patronymic + ' оставил комментарий на ваш вопрос ' + questions[0].title;
                stud.link = '/help/' + id;
                await myHelper.socket(stud);
            }
        }
        user.message = 'Вы оставили комментарий на вопрос ' + questions[0].title;
        user.link = '/help/' + id;
        await myHelper.socket(user);

        return question; 
        
    }
    else //В случае если запрос отправил не учитель
    {
        const entry = await strapi.entityService.findMany('api::feedback.feedback', {
        filters: { user_id: user.id, id: id },
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
        if (entry.length <= 0) { //Уже после обработки запроса в случае если ничего не нашлось - ошибка
            return {
                error: {
                    status: 404,
                    name: "NotFound",
                    message: "Cannot find question"
                }
            };
        }
        let comments = entry[0].comments;//Если все нормально то подгружаем все изначальные и добавляем новый созданный
        comments.push(
        {
            text: ctx.request.body.text,
            comment_user_id: {
                id: user.id
            }
        }
        )
        const question = await strapi.entityService.update('api::feedback.feedback', id, {
        data: {
            comments: comments
        }
        });

        user.message = 'Вы оставили комментарий на ' + question.title;
        user.link = '/help/' + id;
        await myHelper.socket(user);
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { students: user.id },
            populate: ['teacher']
        });
        let teacher = group[0].teacher;
        teacher.message = 'Студент ' + user.name + ' ' + user.last_name + ' ' + user.patronymic + ' оставил комментарий ' + question.title;
        teacher.link = '/help/' + id;
        await myHelper.socket(teacher);

        return question; 
    }
},

async commentsForUser(user) { 
    //нужен сам вопрос и наверное айди юзера? выводить все комменты на этот вопрос
    const questions = await strapi.entityService.findMany('api::feedback.feedback', {
        filters: { user_id: user.id },
        populate: ['user']
    });
    return questions;
},

async commentsForTeacher(user) { 
    const questions = await strapi.entityService.findMany('api::feedback.feedback', {
        filters: { user_id: user.id },
        populate: ['user'],
        
    });
    return questions;
},

async questionsForUser(user) { 
    const questions = await strapi.entityService.findMany('api::feedback.feedback', {
        filters: { user_id: user.id },
        populate: ['user'],
        sort:{['createdAt']:'desc'}
    });
    questions.forEach(question => {
        question.createdAt = Date.parse(question.createdAt);
    });
    return questions;
},

async questionsForTeacher(user) { 
    const group = await strapi.entityService.findMany('api::group.group', {
        filters: { teacher: user.id },
        populate: ['students']
    });
    const questions = [];
    for(let i = 0; i < group[0].students.length; i++) {
       const students = await strapi.entityService.findMany('api::feedback.feedback', {
        filters: { user_id: group[0].students[i] },
        populate: ['user'],
        sort:{['createdAt']:'desc'}
    });
    const questions_from_teacher = await strapi.entityService.findMany('api::feedback.feedback', {
        filters: { user_id: user.id },
        populate: ['user'],
        sort:{['createdAt']:'desc'}
    });
    
    questions.push(...questions_from_teacher);
    questions.push(...students);
    } 
    return questions;
},

async questionForTeacher(user, id) { 
    const group = await strapi.entityService.findMany('api::group.group', {
        filters: { teacher: user.id },
        populate: ['students']
    });
    const questions = [];
    for(let i = 0; i < group[0].students.length; i++) {
       const students = await strapi.entityService.findMany('api::feedback.feedback', {
            filters: { user_id: group[0].students[i], id: id },
            populate: ['user']
        });
        students.forEach(elem => {
            questions.push(elem);
        });
    }
    if (questions.length <= 0) {
        const question = await strapi.entityService.findMany('api::feedback.feedback', {
            filters: { user_id: user.id, id: id },
            populate: {comments: {
                fields: ['id', 'text'],
            }}
        });
        if (question.length <= 0) {
            return {
                error: {
                    status: 404,
                    name: "NotFound",
                    message: "Cannot find question"
                }
            };
        }
        return question;
    } 
    return questions;
},

async questionForUser(user, ctx, id) { ;
    const question = await strapi.entityService.findMany('api::feedback.feedback', {
        filters: { user_id: user.id, id: id },
        populate: {comments: {
            fields: ['id', 'text'],
        }}
    });
    if (question?.length <= 0) {
        return {
            error: {
                status: 404,
                name: "NotFound",
                message: "Cannot find question"
            }
        };
    }
    return question;
},

async commentsForQuestion(user, id) { 
    //Проверки на роль и выдача соответствующих путей
    const question = [];
    if (user.role.name=="Student"){
        console.log("Студент");
        //Запрос со стороны студента
        //Берём все вопросы заданные этим пользователем и нужный нам по id
        
        question.push(await strapi.entityService.findMany('api::feedback.feedback', {
            filters: { user_id: user.id, id: id },
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
        }));
        
    }else if (user.role.name=="Teacher"){
        console.log("Препод");
        //Запрос со стороны преподавателя
        //Берём все вопросы заданные этому учителю и нужный нам по id, не забываем populate
        const TeacherQ = []
        const group = await strapi.entityService.findMany('api::group.group', {
            filters: { teacher: user.id },
            populate: ['students']
        });
        for(let i = 0; i < group[0].students.length; i++) {
            const students = await strapi.entityService.findMany('api::feedback.feedback', {
                filters: { user_id: group[0].students[i], id: id },
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
            students.forEach(elem => {
                TeacherQ.push(elem);
            });
        }
        question.push(TeacherQ)

        if (question.length <= 1) {
            question.push(await strapi.entityService.findMany('api::feedback.feedback', {
                filters: { user_id: user.id, id: id },
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
            }));

        }
        
    } else {
        //Какой то левый запрос
        return {
            error: {
                status: 404,
                name: "NotFound",
                message: "Unknown role"
            }
        };
    }
    //В случае если мы не получили вопрос то кидаем 404
    if (question.length <= 0) {
        return {
            error: {
                status: 404,
                name: "NotFound",
                message: "Cannot find question"
            }
        };
    }
    // Обрабатываем данные для удобного чтения с фронта
    const comments = [];
    if (question[0][0]) {
        if (question[0][0].comments) {
            for (let i=0;i<question[0][0].comments.length;i++){
                let item = question[0][0].comments[i];
                const users = await strapi.entityService.findMany('plugin::users-permissions.user',
                {
                    filters:{
                        id: item.comment_user_id.id
                    },
                    populate: ['role'] 
                }
                );
                comments.push({
                    id: item.id,
                    text: item.text,
                    user:{
                        id: item.comment_user_id.id,
                        name: users[0]?.name,
                        lastName: users[0]?.last_name,
                        role: users[0]?.role?.name,
                        rus_role: users[0]?.role?.description
                    }
                })
            };
        }
    }
    // if (question[1][0]) {
    //     if (question[1][0].comments) {
    //         for (let i=0;i<question[1][0].comments.length;i++){
    //             let item = question[1][0].comments[i];
    //             const users = await strapi.entityService.findMany('plugin::users-permissions.user',
    //             {
    //                 filters:{
    //                     id: item.comment_user_id.id
    //                 },
    //                 populate: ['role'] 
    //             }
    //             );
    //             comments.push({
    //                 id: item.id,
    //                 text: item.text,
    //                 user:{
    //                     id: item.comment_user_id.id,
    //                     name: users[0]?.name,
    //                     lastName: users[0]?.last_name,
    //                     role: users[0]?.role?.name,
    //                     rus_role: users[0]?.role?.description
    //                 }
    //             })
    //         };
    //     }
    // }
    //Если мы ничего не получили, кидаем 404
    if (comments.length <= 0) {
        return {
            error: {
                status: 404,
                name: "NotFound",
                message: "Cannot find comments"
            }
        };
    }
    return comments;
},
}));
