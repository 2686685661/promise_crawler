/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-07-13 15:06:53 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-07-13 15:08:24
 * @function: 爬取慕课网页面的一个基于node的小爬虫
 */
let http = require('http');
let cheerio = require('cheerio');
let url = 'http://www.imooc.com/learn/348';

function filterChapters(html) {
    let $ = cheerio.load(html);
    let chapters = $('.chapter');

    let courseData = [];

    chapters.each(function(item) {
        let chapter = $(this);
        let chapterTitle = chapter.find('strong').text();
        let videos = chapter.find('.video').children('li');
        let chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }

        videos.each((item) => {
            let video = $(this).find('.J-media-item');
            let videoTitle = video.text();
            let id = video.attr('href').split('video/')[1];
            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        })

        courseData.push(chapterData);
    })
    return courseData;
}

function printCourseInfo(courseData) {
    courseData.forEach((item) => {
        let chapterTitle = item.chapterTitle;
        console.log(chapterTitle+'\n');

        item.videos.forEach((video) => {
            console.log('【' + video.id + '】' + video.title + '\n') 
        })
    })
}

http.get(url, (res) => {
    let html = '';
    res.on('data', (data) => {
        html += data;
    })

    res.on('end', () => {
        let courseData = filterChapters(html);

        printCourseInfo(courseData);
    })
}).on('error', ()=> {
    console.log('error');
})