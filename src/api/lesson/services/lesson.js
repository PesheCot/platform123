'use strict';

const lesson = require('../controllers/lesson');

/**
 * lesson service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lesson.lesson', ({ strapi }) => ({
    async findByModule(slug, user) {  
        const module = await strapi.db.query('api::module.module').findOne({
            select: ['id'],
            where: {
              slug
            },
        });

        const lessons = await strapi.entityService.findMany('api::lesson.lesson', {
            fields: ['id', 'slug', 'name', 'description', 'type'],
            filters: { module: module.id, publishedAt: { $notNull: true } },
            sort: { order: 'ASC' },
        });

        if (lessons.length > 0) {
            let group = await strapi.db.query('api::group.group').findOne({
                select: ['id'],
                where: { students: user.id}
            });
            if (!group) {
                group = await strapi.db.query('api::group.group').findOne({
                    select: ['id'],
                    where: { teacher: user } 
                });
            }
            for (let key in lessons) {
                // Добавление даты
                const schedule = await strapi.db.query('api::schedule.schedule').findOne({
                    select: ['date'],
                    where: {
                        $and: [
                            { group: group.id },
                            { lesson: lessons[key].id }
                        ]
                    }
                });

                if (schedule) {
                    lessons[key].date = schedule.date;
                } else if (user.role.name == 'Student') {
                    //Группа с всеми уроками
                    if (group.id != 4) {
                        lessons[key].is_closed = true;
                    }
                }

                // Добавление оценки
                const journal = await strapi.db.query('api::journal.journal').findOne({
                    select: ['grade', 'on_time'],
                    where: {
                        $and: [
                            { student: user.id },
                            { lesson: lessons[key].id }
                        ]
                    }
                });

                if (journal) {
                    lessons[key].journal = journal;
                }
            }
        }

        return {
            current_date: new Date(),
            lessons
        };
    },
    async getContent(slug, user) { 
        const lesson = await strapi.entityService.findMany('api::lesson.lesson', {
            fields: ['id', 'name', 'content'],
            timestamps: ['new_updated_at_name'],
            populate: ['tasks', 'module'],
            filters: { slug, publishedAt: { $notNull: true } },
        });
        const note = await strapi.entityService.findMany('api::note.note', {
            fields: ['id', 'content', 'updated_at'],
            filters: { lesson: lesson[0].id, user: user.id },
        });

        if (lesson.length > 0) {
            if (note.length > 0) {
                note[0].data_parse = Date.parse(note[0].updatedAt);
                lesson[0].note = note;
            }

            let all_lessons = await this.findByModule(lesson[0].module.slug, user);  
            let was = false; 
            let next_lesson;
            let prev_lesson;

            await all_lessons.lessons.forEach ((lesson_el, index, arr) => {
                if (was == true) {
                    prev_lesson = all_lessons.lessons[index - 2]
                } else {
                    prev_lesson = all_lessons.lessons[index - 1]
                }
                if (was == true) {
                    next_lesson = lesson_el
                    arr.length = index + 1;
                }
                if (lesson_el.id == lesson[0].id) {
                    was = true
                }
            });

            if (next_lesson == undefined || next_lesson.is_closed == true) {
                next_lesson = false
            }
            if (prev_lesson == undefined || prev_lesson.is_closed == true) {
                prev_lesson = false
            }

            lesson[0].next_lesson = next_lesson
            lesson[0].prev_lesson = prev_lesson
            delete lesson[0].module;     
            return lesson[0];
        }

        return;
    }
}));
