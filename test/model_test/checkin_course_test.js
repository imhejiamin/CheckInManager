import assert from 'assert';
import { checkinCourseModel } from '../../models';
import { generateCheckinID } from '../../services/';
import { courses } from './course_test';


export var checkinIDs = new Array(courses.length).fill().map((_, i) => generateCheckinID(i + 1));

export async function checkinCourseModelTest() {
  for (let i = 0; i < courses.length; i++) {
    assert.deepEqual((await checkinCourseModel.createCheckinCourse(i + 1, checkinIDs[i])).affectedRows, 1);
  }

}
