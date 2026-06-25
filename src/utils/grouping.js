export const DEFAULT_ROLES = ['모둠장', '기록자', '발표자', '자료 담당', '시간 관리자'];

export const EXAMPLE_NAMES = [
  '김민준',
  '이서연',
  '박도윤',
  '최하은',
  '정지호',
  '강지우',
  '조서준',
  '윤아린',
  '장하준',
  '임서아',
  '한유찬',
  '오나윤',
  '신예준',
  '유다은',
  '문시우',
  '백채원',
  '송지안',
  '권도현',
  '황윤서',
  '안태오',
];

export function parseStudentNames(value) {
  return value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

export function parseRoles(value) {
  const roles = value
    .split(/[\n,]/)
    .map((role) => role.trim())
    .filter(Boolean);

  return roles.length > 0 ? roles : ['역할 없음'];
}

export function findDuplicateNames(names) {
  const counts = new Map();

  names.forEach((name) => {
    counts.set(name, (counts.get(name) || 0) + 1);
  });

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([name]) => name);
}

export function shuffleArray(items, randomFn = Math.random) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomFn() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function createGroups(students, requestedGroupCount, roles, randomFn = Math.random) {
  if (students.length === 0) {
    return {
      groups: [],
      adjustedGroupCount: 0,
      wasAdjusted: false,
    };
  }

  const clampedCount = Math.min(10, Math.max(2, Number(requestedGroupCount) || 2));
  const adjustedGroupCount = Math.min(clampedCount, students.length);
  const shuffledStudents = shuffleArray(students, randomFn);
  const groups = Array.from({ length: adjustedGroupCount }, (_, index) => ({
    id: cryptoSafeId(index),
    name: `${index + 1}모둠`,
    students: [],
  }));

  shuffledStudents.forEach((student, index) => {
    groups[index % adjustedGroupCount].students.push({ name: student, role: '' });
  });

  groups.forEach((group, groupIndex) => {
    group.students = group.students.map((student, studentIndex) => ({
      ...student,
      role: roles[(studentIndex + groupIndex) % roles.length],
    }));
  });

  return {
    groups,
    adjustedGroupCount,
    wasAdjusted: adjustedGroupCount !== clampedCount,
  };
}

export function formatGroupsForCopy(groups) {
  if (groups.length === 0) return '';

  const lines = ['우리 반 모둠 편성 결과'];

  groups.forEach((group) => {
    lines.push('', `[${group.name}]`);
    group.students.forEach((student) => {
      lines.push(`- ${student.name}: ${student.role}`);
    });
  });

  return lines.join('\n');
}

function cryptoSafeId(index) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `group-${index}-${Math.random().toString(36).slice(2)}`;
}
