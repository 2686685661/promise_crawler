let http = require('http');
let cheerio = require('cheerio');
// let Promise = require('Promise');
let baseUrl = 'http://www.imooc.com/learn/';
let videoIds = [348, 259, 197, 134, 75];

function filterChapters(html) {
    let $ = cheerio.load(html);
    let chapters = $('.chapter');
    let title = $('#page_header .path span').text();
    let number = parseInt($($('.info_num i')[0]).text().trim(), 10);

    // courseData = {
    //     title: title,
    //     number: number,
    //     videos: [{
    //         chapterTitle: '',
    //         videos: [
    //             title=>'',
    //             id=>''
    //         ]
    //     }]
    // }
    let courseData = {
        videos: [],
        number: number,
        title: title
    }

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

        courseData.videos.push(chapterData);
    })
    return courseData;
}

function printCourseInfo(coursesData) {
    coursesData.forEach((courseData) => {
        console.log(courseData.number + '人学过' + courseData.title + '\n');
    })
    coursesData.forEach((courseData) => {
        console.log('###' + courseData.title + '\n');
        courseData.videos.forEach((item) => {
            let chapterTitle = courseData.chapterTitle;

            console.log(chapterTitle+'\n');

            item.videos.forEach((video) => {
                console.log('【' + video.id + '】' + video.title + '\n') 
            })
        })

    })
}

function getPageAsync(url) {
    return new Promise((resolve, reject) => {
        console.log('正在爬取' + url);

        http.get(url, (res) => {
            let html = '';
            res.on('data', (data) => {
                html += data;
            })
        
            res.on('end', () => {
                resolve(html);
        
            })
        }).on('error', (e)=> {
            reject(e);
            console.log('error');
        })
    })
}

let fetchCourseArray = [];

videoIds.forEach((id) => {
    fetchCourseArray.push(getPageAsync(baseUrl + id));
})


Promise.all(fetchCourseArray).then((pages) => {
    let coursesData = [];

    pages.forEach((html) => {
        let courses = filterChapters(html);
        coursesData.push(courses);
    })

    coursesData.sort((a, b) => {
        return a.number < b.number;
    })

    printCourseInfo(coursesData)

})

