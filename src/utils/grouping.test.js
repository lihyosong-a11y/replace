import { describe, expect, it } from 'vitest';
import {
  createGroups,
  findDuplicateNames,
  formatGroupsForCopy,
  parseRoles,
  parseStudentNames,
} from './grouping';

const steadyRandom = () => 0.42;

describe('grouping utilities', () => {
  it('parses student names one per line and removes blanks', () => {
    expect(parseStudentNames('김민준\n\n 이서연 \r\n박도윤')).toEqual(['김민준', '이서연', '박도윤']);
  });

  it('finds duplicated names', () => {
    expect(findDuplicateNames(['김민준', '이서연', '김민준', '박도윤'])).toEqual(['김민준']);
  });

  it('keeps group sizes as even as possible', () => {
    const students = ['가', '나', '다', '라', '마', '바', '사'];
    const result = createGroups(students, 3, ['모둠장', '기록자'], steadyRandom);
    const sizes = result.groups.map((group) => group.students.length);

    expect(sizes).toEqual([3, 2, 2]);
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
  });

  it('adjusts the group count when there are fewer students than groups', () => {
    const result = createGroups(['가', '나', '다'], 8, ['모둠장'], steadyRandom);

    expect(result.adjustedGroupCount).toBe(3);
    expect(result.wasAdjusted).toBe(true);
    expect(result.groups).toHaveLength(3);
  });

  it('rotates roles across groups', () => {
    const result = createGroups(['가', '나', '다', '라'], 2, ['모둠장', '기록자'], steadyRandom);
    const firstGroupRoles = result.groups[0].students.map((student) => student.role);
    const secondGroupRoles = result.groups[1].students.map((student) => student.role);

    expect(firstGroupRoles).toEqual(['모둠장', '기록자']);
    expect(secondGroupRoles).toEqual(['기록자', '모둠장']);
  });

  it('parses roles from new lines or commas', () => {
    expect(parseRoles('모둠장, 기록자\n발표자')).toEqual(['모둠장', '기록자', '발표자']);
  });

  it('formats groups as copyable text', () => {
    const text = formatGroupsForCopy([
      {
        name: '1모둠',
        students: [
          { name: '김민준', role: '모둠장' },
          { name: '이서연', role: '기록자' },
        ],
      },
    ]);

    expect(text).toContain('[1모둠]');
    expect(text).toContain('- 김민준: 모둠장');
  });
});
