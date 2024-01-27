interface SubjectDataProps {
    _id?: string
    name: string
    description: string
    supervisor: {
        _id: string,
        userName: string
    }
    goal: string
    credits: number
    language: "Czech" | "English",
    students?: Array<
        {
            _id: string,
            userName: string
        }
    >
    topicIdList:Array<string>
    digitalContentIdList:Array<string>
}

export { SubjectDataProps }