const GetRolePermissions = (role:"Teacher"|"Student"|"Admin")=>
{
    return {
        "Teacher":["create:digitalContent","create:subject","create:topic",
                    "delete:digitalContent","delete:subject","delete:topic",
                    "read:digitalContent","read:subject",
                    "update:digitalContent","update:subject","update:topic",
                ],
        "Student":["read:digitalContent","read:SubjectStudent","read:topicStudent"],
        "Admin":["admin:admin"]
    }[role]
}

const GetRoleByPermissions = (permissions:Array<string>)=>
{
    const roles = ["Admin","Teacher","Student"];
    for(let r in roles)
    {
        if(roles[r] === "Admin" || roles[r] === "Teacher" || roles[r] === "Student")
        {
            if(GetRolePermissions(roles[r]).every(r=>permissions.includes(r)))
                return roles[r];
        }
        
    }
}

export {GetRolePermissions, GetRoleByPermissions}