import { execAsync } from './util';

// 学生签到信息（待定：ip,mac）
// TODO: ip/mac信息
export async function createCheckinStudentTable() {
  return await execAsync(
    `CREATE TABLE IF NOT EXISTS CHECKIN_STUDENT(
      checkin_id          VARCHAR(50)  NOT NULL,
      student_id          VARCHAR(50)  NOT NULL,
      checkined_datetime  DATETIME     DEFAULT CURRENT_TIMESTAMP NOT NULL,
      PRIMARY KEY (checkin_id, student_id)
    )`,
    undefined,
    'Table CHECKIN_STUDENT created...');
}

export async function dropCheckinStudentTable() {
  return await execAsync('DROP TABLE CHECKIN_STUDENT', undefined, 'drop table CHECKIN_STUDENT');
}

// 学生进行签到
// TODO: 记录ip/mac信息
export async function createCheckinStudent(checkin_student) {
  return await execAsync(`INSERT INTO CHECKIN_STUDENT (checkin_id, student_id) VALUES (?, ?)`,
    [checkin_student.checkin_id, checkin_student.student_id],
    'create checkin_student ' + JSON.stringify(checkin_student));
}

// 获得课程所有签到历史记录
// 返回 checkin_id 签到日期【yyyy-mm-dd hh:mm:ss】 签到人数 未签到人数
// 按签到日期递减顺序排列
export async function getAllCourseCheckin(course_id) {
  return await execAsync(
    `SELECT checkin_id, date_time, checkedin_num, (couser_member_num - checkedin_num) AS uncheckedin_num
      FROM
        ((SELECT COUNT(student_id) AS checkedin_num
          FROM CHECKIN_STUDENT
          GROUP BY checkin_id
        ) AS CHECKEDIN_COUNT
      LEFT JOIN CHECKIN_COURSE
        ON CHECKIN_COURSE.checkin_id = CHECKEDIN_COUNT.checkin_id
      LEFT JOIN
        (SELECT COUNT(student_id) AS couser_member_num
          FROM COURSE_MEMBER
          GROUP BY course_id
        ) AS COURSE_MEMBER_COUNT
        ON COURSE_MEMBER_COUNT.course_id = COURSE_MEMBER.course_id
      WHERE course_id = ?)
    ORDER BY date_time DESC`,
    [course_id],
    `get all checkin history by course_id ${course_id}`);
}

// 选择某一条签到记录查看已签到学生列表
export async function getAllCourseCheckinStudent(checkin_id) {
  return await execAsync(
    `SELECT student_id, student_name
      FROM
        ((SELECT student_id
          FROM CHECKIN_STUDENT
          GROUP BY checkin_id
        ) AS CHECKEDIN_STUDENT
      LEFT JOIN STUDENT
        ON STUDENT.student_id = CHECKIN_STUDENT.student_id
      WHERE checkin_id = ?)
    ORDER BY student_id`,
    [checkin_id],
    `get a checkin history by checkin_id ${checkin_id}`
  );
}

// 选择某一条签到记录查看未签到学生列表
// 先选择签到对应的全班 not in 选择已签到的人
export async function getAllCourseUncheckinStudent(checkin_id) {
  return await execAsync(
    `SELECT student_id, student_name
      FROM
        (SELECT student_id, student_name
          FROM STUDENT
        LEFT JOIN COURSE_MEMBER
          ON STUDENT.student_id = COURSE_MEMBER.student_id
        LEFT JOIN CHECKIN_COURSE
          ON STUDENT.course_id = CHECKIN_COURSE.course_id
        WHERE checkin_id = ?
        ) AS ALL_STUDENT
      WHERE ALL_STUDENT.student_id NOT IN (
        SELECT student_id
        FROM
          ((SELECT student_id
            FROM
              CHECKIN_STUDENT
            GROUP BY checkin_id
          ) AS CHECKEDIN_STUDENT
        LEFT JOIN STUDENT
          ON STUDENT.student_id = CHECKIN_STUDENT.student_id
        WHERE checkin_id = ?))
    ORDER BY student_id`,
    [checkin_id, checkin_id],
    `get a uncheckin history by checkin_id ${checkin_id}`
  );
}

// 插入签到数据：学号 签到id
export async function createCheckinStudent(student_id, checkin_id) {
  return await execAsync(
    `INSERT INTO CHECKIN_STUDENT (student_id, checkin_id) VALUES (?, ?)`,
    [student_id, checkin_id],
    `insert checkin data by student_id ${student_id} and checkin_id ${checkin_id}`
  );
}

// 查看某学生是否属于该签到课程
export async function checkIfStudentInCheckinCourse(student_id, student_name, checkin_id) {
  return await execAsync(
    `SELECT student_id, student_name
      FROM
        (SELECT student_id
          FROM COURSE_MEMBER
         GROUP BY course_id) AS COURSE_STUDENTID
      LEFT JOIN COURSE
        ON COURSE_STUDENTID.course_id = COURSE.course_id
      LEFT JOIN CHECKIN_COURSE
        ON CHECKIN_COURSE.course_id = COURSE.course_id
    WHERE checkin_id = ? AND student_id = ? AND student_name = ?`,
    [checkin_id, student_id, student_name],
    `check if student ${student_id} ${student_name} in checkin-course ${checkin_id}`
  );
}

// 查看某次签到的签到人数
export async function getStudentNumInCheckinStudent(checkin_id) {
  return await execAsync(
    `SELECT COUNT(*) AS checkedin_num
      FROM
      (SELECT * FROM
        CHECKIN_STUDENT
      GROUP BY checkin_id)
    WHERE checkin_id = ?`,
    [checkin_id],
    `get number of checkined student by checkin_id ${checkin_id}`
  );
}
