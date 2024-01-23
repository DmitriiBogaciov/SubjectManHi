interface StudyProgrammeDataPorps {
    id?: String,
    name: String,
    description: String,
    language: "Czech" | "English",
    studyDegree: "Bachelor" | "Master",
    subjects: Array<
        {
            _id: String,
            year: number,
            semester: "winter" | "summer",
            type: "mandatory" | "optional" | "mandatory_optional"
        }
    >

}

export type { StudyProgrammeDataPorps }