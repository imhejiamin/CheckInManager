const fs = require('fs');
const Vue = require('vue');
const render = require('vue-server-renderer');
// TODO 发送网页
export function sendPage(ctx, status = 200, data, str) {
    //sendData(ctx, status, data);
    console.log('login');
    console.log(status);
    console.log(ctx.request.path);
    console.log(ctx.request.url);
    console.log(data);
    console.log(str);
    
    //教师/管理员登录界面
    if(ctx.request.path ==='/user/login'){
        ctx.response.status = status;
        ctx.response.body = fs.createReadStream('./views/html/login.html');
        ctx.response.type = 'html';
        console.log('你在登陆界面');
    };

    

    //教师主页：教师的课程列表界面
    if(ctx.request.path ==='/course'){
        console.log('你在课程列表');
        const courseList_renderer = render.createRenderer({
            template: fs.readFileSync('./views/html/teacher/courseList_template.html', 'utf-8')
        });
        console.log(data);
        console.log(typeof(data));
        const tem = new Vue({
            //el:'#Courses',
            data: JSON.parse(data),
            template: fs.readFileSync('./views/html/teacher/courseList_markup.html', 'utf-8')
        });

        courseList_renderer.renderToString(tem, (err, html) => {
            if (err) {
                console.log(err);
                ctx.response.status = 500;
                ctx.response.body = 'Internal Server Error';
                return;
            }
            ctx.response.body = html;
            console.log('courseList html');
        })
    };

    //教师界面：课程详情界面
    if(str==='courseDetail'){
        console.log('你在课程详情界面');
        const courseDetail_renderer = render.createRenderer({
            template: fs.readFileSync('./views/html/teacher/courseDetail_template.html', 'utf-8')
        });
        const tem = new Vue({
            data:JSON.parse(data),
            template: fs.readFileSync('./views/html/teacher/courseDetail_markup.html', 'utf-8')
        });

        courseDetail_renderer.renderToString(tem, (err, html) => {
            if (err) {
                console.log(err);
                ctx.response.status = 500;
                ctx.response.body = 'Internal Server Error';
                return;
            }
            ctx.response.body = html;
            console.log('courseDetail html');
        })

    };

    //教师界面：学生名单界面
    if(str ==='studentNameListPage'){
        console.log('你在studentNameListPage界面');
        const studentNameListPage_renderer = render.createRenderer({
            template: fs.readFileSync('./views/html/teacher/studentNameListPage_template.html', 'utf-8')
        });
        const tem = new Vue({
            data:JSON.parse(data),
            template: fs.readFileSync('./views/html/teacher/studentNameListPage_markup.html', 'utf-8')
        });

        studentNameListPage_renderer.renderToString(tem, (err, html) => {
            if (err) {
                console.log(err);
                ctx.response.status = 500;
                ctx.response.body = 'Internal Server Error';
                return;
            }
            ctx.response.body = html;
            console.log('studentNameListPage html');
        })
    }


    //教师界面：历史签到界面
    if(str ==='checkAttendancePage'){
        console.log('你在checkAttendancePage界面');
        const checkAttendancePage_renderer = render.createRenderer({
            template: fs.readFileSync('./views/html/teacher/checkAttendancePage_template.html', 'utf-8')
        });
        const tem = new Vue({
            data:JSON.parse(data),
            template: fs.readFileSync('./views/html/teacher/checkAttendancePage_markup.html', 'utf-8')
        });

        checkAttendancePage_renderer.renderToString(tem, (err, html) => {
            if (err) {
                console.log(err);
                ctx.response.status = 500;
                ctx.response.body = 'Internal Server Error';
                return;
            }
            ctx.response.body = html;
            console.log('checkAttendancePage html');
        })
    }


    //教师界面：点进某一个签到记录查看详情
    if(str ==='singleAttendancePage'){
        console.log('你在singleAttendancePage界面');
        const singleAttendancePage_renderer = render.createRenderer({
            template: fs.readFileSync('./views/html/teacher/singleAttendancePage_template.html', 'utf-8')
        });
        const tem = new Vue({
            data:JSON.parse(data),
            template: fs.readFileSync('./views/html/teacher/singleAttendancePage_markup.html', 'utf-8')
        });

        singleAttendancePage_renderer.renderToString(tem, (err, html) => {
            if (err) {
                console.log(err);
                ctx.response.status = 500;
                ctx.response.body = 'Internal Server Error';
                return;
            }
            ctx.response.body = html;
            console.log('singleAttendancePage html');
        })
    }

    //教师界面：获取二维码签到界面
    if(str ==='attendancePage'){
        console.log('你在发起签到界面');
        ctx.response.status = status;
        ctx.response.type = 'html';
        ctx.response.body = fs.createReadStream('./views/html/teacher/attendancePage.html');
    }





    
    //管理员主页：管理教师界面
    if(ctx.request.path =='/user'){
        console.log('你在教师列表界面');
        const teacherManage_renderer = render.createRenderer({
            template: require('fs').readFileSync('./views/html/manager/teacherManage_template.html', 'utf-8')
        })
        const tem = new Vue({
            data: JSON.parse(data),
            template: fs.readFileSync('./views/html/manager/teacherManage_markup.html', 'utf-8')
        })

        teacherManage_renderer.renderToString(tem, (err, html) => {
            if (err) {
                console.log(err);
                ctx.response.status = 500;
                ctx.response.body = 'Internal Server Error';
                return;
            }
            ctx.response.body = html;
            console.log('teacher manage html');
            //console.log(html);

        })

    };

    if(str==='changePasswordPage'){
        ctx.response.status = status;
        ctx.response.body = fs.createReadStream('./views/html/teacher/changePasswordPage.html');
        ctx.response.type = 'html';
        console.log('你在修改密码界面');
    };

    if(str==='addTeacherPage'){
        ctx.response.status = status;
        ctx.response.body = fs.createReadStream('./views/html/manager/addTeacherPage.html');
        ctx.response.type = 'html';
        console.log('你在添加教师界面');
    };


    //这个暂时有问题
    if( str==='addAllStudentPage' ){
        ctx.response.status = status;
        ctx.response.body = fs.createReadStream('./views/html/manager/addAllStudentPage.html');
        ctx.response.type = 'html';
        console.log('你在添加全级学生界面');
    };
}

// TODO 仅发送数据
export function sendData(ctx, status = 200, data, type = 'application/json') {
    console.log('什么情况啊');
  ctx.response.status = status;
  ctx.response.body = data;
  ctx.response.type = type;
  // console.log(ctx.response.status);
}
