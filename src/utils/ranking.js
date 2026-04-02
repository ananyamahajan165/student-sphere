function getGrade(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 75) return "A";
  if (marks >= 60) return "B";
  if (marks >= 40) return "C";
  return "F";
}

function calculateRank(students) {
  students.sort(function (a, b) {
    return b.marks - a.marks;
  });

  var rank = 1;

  for (var i = 0; i < students.length; i++) {
    if (i > 0 && students[i].marks < students[i - 1].marks) {
      rank = i + 1;
    }

    students[i].rank = rank;
    students[i].grade = getGrade(students[i].marks);
  }

  return students;
}

module.exports = { calculateRank };