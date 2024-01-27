
interface StudyProgrammeSubjectsDataProps {

    _id: string,
    year: number,
    semester: "winter" | "summer",
    type: "mandatory" | "optional" | "mandatory_optional"
}
interface StudyProgrammeDataProps {
    _id?: string,
    name: string,
    description: string,
    language: "Czech" | "English",
    studyDegree: "Bachelor" | "Master",
    subjects: Array<StudyProgrammeSubjectsDataProps>

}

export { StudyProgrammeDataProps, StudyProgrammeSubjectsDataProps }