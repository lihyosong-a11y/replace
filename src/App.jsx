import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  Printer,
  RotateCcw,
  Shuffle,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  DEFAULT_ROLES,
  EXAMPLE_NAMES,
  createGroups,
  findDuplicateNames,
  formatGroupsForCopy,
  parseRoles,
  parseStudentNames,
} from './utils/grouping';

const INITIAL_GROUP_COUNT = 4;

function App() {
  const [studentsText, setStudentsText] = useState('');
  const [groupCount, setGroupCount] = useState(INITIAL_GROUP_COUNT);
  const [roleText, setRoleText] = useState(DEFAULT_ROLES.join('\n'));
  const [groups, setGroups] = useState([]);
  const [notice, setNotice] = useState(null);

  const studentNames = useMemo(() => parseStudentNames(studentsText), [studentsText]);
  const duplicateNames = useMemo(() => findDuplicateNames(studentNames), [studentNames]);
  const roleList = useMemo(() => parseRoles(roleText), [roleText]);
  const totalAssigned = groups.reduce((sum, group) => sum + group.students.length, 0);

  const makeGroups = () => {
    const names = parseStudentNames(studentsText);
    const duplicates = findDuplicateNames(names);

    if (names.length === 0) {
      setGroups([]);
      setNotice({
        type: 'error',
        text: '학생 이름을 한 명 이상 입력해 주세요.',
      });
      return;
    }

    if (duplicates.length > 0) {
      setGroups([]);
      setNotice({
        type: 'warning',
        text: `중복된 이름이 있어요: ${duplicates.join(', ')}. 동명이인은 번호나 성을 붙여 구분해 주세요.`,
      });
      return;
    }

    const result = createGroups(names, groupCount, roleList);
    setGroups(result.groups);

    if (result.wasAdjusted) {
      setNotice({
        type: 'info',
        text: `학생 수가 ${names.length}명이라 모둠 수를 ${result.adjustedGroupCount}개로 조정했어요.`,
      });
      return;
    }

    setNotice({
      type: 'success',
      text: `${names.length}명을 ${result.adjustedGroupCount}개 모둠으로 편성했어요.`,
    });
  };

  const addExamples = () => {
    setStudentsText(EXAMPLE_NAMES.join('\n'));
    setNotice({
      type: 'info',
      text: '예시 이름을 넣었어요. 필요에 맞게 수정해 주세요.',
    });
  };

  const copyResult = async () => {
    const copyText = formatGroupsForCopy(groups);

    if (!copyText) {
      setNotice({
        type: 'error',
        text: '복사할 모둠 결과가 아직 없어요.',
      });
      return;
    }

    try {
      await copyToClipboard(copyText);
      setNotice({
        type: 'success',
        text: '모둠 결과를 클립보드에 복사했어요.',
      });
    } catch {
      setNotice({
        type: 'error',
        text: '클립보드 복사에 실패했어요. 브라우저 권한을 확인해 주세요.',
      });
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">교사용 웹앱</p>
          <h1>우리 반 모둠 편성기</h1>
        </div>
        <div className="header-count" aria-label="입력한 학생 수">
          <Users aria-hidden="true" size={20} />
          <strong>{studentNames.length}</strong>
          <span>명</span>
        </div>
      </header>

      <main className="workspace">
        <section className="control-surface no-print" aria-labelledby="input-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">입력</p>
              <h2 id="input-title">학생 이름</h2>
            </div>
            <button className="ghost-button" type="button" onClick={addExamples} title="예시 넣기">
              <Sparkles aria-hidden="true" size={18} />
              예시 넣기
            </button>
          </div>

          <label className="field-label" htmlFor="studentNames">
            한 줄에 한 명씩
          </label>
          <textarea
            id="studentNames"
            value={studentsText}
            onChange={(event) => setStudentsText(event.target.value)}
            placeholder="여기에 학생 이름을 입력하세요"
            spellCheck="false"
          />

          {duplicateNames.length > 0 && (
            <div className="inline-warning" role="alert">
              <AlertTriangle aria-hidden="true" size={18} />
              <span>중복: {duplicateNames.join(', ')}</span>
            </div>
          )}

          <div className="settings-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="groupCount">
                모둠 수
              </label>
              <select
                id="groupCount"
                value={groupCount}
                onChange={(event) => setGroupCount(Number(event.target.value))}
              >
                {Array.from({ length: 9 }, (_, index) => index + 2).map((count) => (
                  <option key={count} value={count}>
                    {count}개
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group roles-field">
              <label className="field-label" htmlFor="roleNames">
                역할 목록
              </label>
              <textarea
                id="roleNames"
                className="roles-textarea"
                value={roleText}
                onChange={(event) => setRoleText(event.target.value)}
                spellCheck="false"
              />
            </div>
          </div>

          <div className="primary-actions">
            <button className="primary-button" type="button" onClick={makeGroups} title="랜덤 모둠 편성하기">
              <Shuffle aria-hidden="true" size={20} />
              랜덤 모둠 편성하기
            </button>
            <button className="secondary-button" type="button" onClick={makeGroups} title="다시 섞기">
              <RotateCcw aria-hidden="true" size={19} />
              다시 섞기
            </button>
          </div>
        </section>

        <section className="result-surface" aria-labelledby="result-title">
          <div className="section-heading result-heading">
            <div>
              <p className="eyebrow">결과</p>
              <h2 id="result-title">모둠 편성</h2>
            </div>
            <div className="result-actions no-print">
              <button className="utility-button" type="button" onClick={copyResult} title="결과 복사하기">
                <ClipboardCopy aria-hidden="true" size={19} />
                결과 복사하기
              </button>
              <button className="utility-button" type="button" onClick={() => window.print()} title="인쇄하기">
                <Printer aria-hidden="true" size={19} />
                인쇄하기
              </button>
            </div>
          </div>

          {notice && (
            <div className={`notice ${notice.type}`} role="status">
              {notice.type === 'success' ? (
                <CheckCircle2 aria-hidden="true" size={18} />
              ) : (
                <AlertTriangle aria-hidden="true" size={18} />
              )}
              <span>{notice.text}</span>
            </div>
          )}

          {groups.length > 0 ? (
            <>
              <div className="result-summary">
                <span>{groups.length}개 모둠</span>
                <span>{totalAssigned}명</span>
                <span>{roleList.length}개 역할</span>
              </div>
              <div className="group-grid">
                {groups.map((group) => (
                  <article className="group-card" key={group.id}>
                    <div className="group-card-header">
                      <h3>{group.name}</h3>
                      <span>{group.students.length}명</span>
                    </div>
                    <ul className="student-list">
                      {group.students.map((student) => (
                        <li key={`${group.id}-${student.name}`}>
                          <span className="student-name">{student.name}</span>
                          <span className="role-pill">{student.role}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-result">
              <Users aria-hidden="true" size={34} />
              <p>아직 편성된 모둠이 없어요.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export default App;
