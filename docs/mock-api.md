- Create [GET] /users/me
response:
    {
        status: boolean,
        message: string,
        data: {
            id: string,
            name: string,
            role: string
        }
    }

- Create [GET] /members
response:
    {
        status: boolean,
        message: string,
        data: [
            id: string,
            name: string,
            email: string,
            role: string,
            department: string,
            status: string (active/inactive)
            joinDate: datetime
        ]
    }

- Create [POST] /members
response:
    {
        status: boolean,
        message: string,
        data: [
            {
                id: string,
                name: string,
                email: string,
                role: string,
                department: string,
                status: string (active/inactive)
                joinDate: datetime
            },
            ....
        ]
    }

payload:
    {
        name: string,
        email: string,
        role: string,
        department: string,
        status: string (active/inactive)
        joinDate: datetime
    }

- Create [PUT] /members/:id
response:
    {
        status: boolean,
        message: string,
        data: {
            name: string,
            email: string,
            role: string,
            department: string,
            status: string (active/inactive)
            joinDate: datetime
        }
    }

payload:
    {
        name: string,
        email: string,
        role: string,
        department: string,
        status: string (active/inactive)
        joinDate?: datetime
    }

- Create [DELETE] /members/:id
response:
    {
        status: boolean,
        message: string,
        data: {
            name: string,
            email: string,
            role: string,
            department: string,
            status: string (active/inactive)
            joinDate: datetime
        }
    }

- Create [POST] /members/bulk-delete
response:
    {
        status: boolean,
        message: string,
        data: [
            {
                id: string,
                name: string,
                email: string,
                role: string,
                department: string,
                status: string (active/inactive)
                joinDate: datetime
            },
            ....
        ]
    }
payload:
    {
        ids: string[],
    }

- Create [GET] /departments
response:
    {
        status: boolean,
        message: string,
        data: [
            {
                id: string,
                name: string,
            },
            ....
        ]
    }


- Create [GET] /employment/types
response:
    {
        status: boolean,
        message: string,
        data: [
            {
                id: string,
                name: string,
            },
            ....
        ]
    }

- Create [GET] /analytics
response:
    {
        status: boolean,
        message: string,
        data: [
            {
                key: "totalMembers",
                label: "Total Members",
                value: number,
                trend: "+xx this month"
            },
            {
                key: "activeMembers",
                label: "Active Now",
                value: number,
                trend: "xx% live activity"
            },
            {
                key: "departments",
                label: "Departments",
                value: number,
                trend: "xx active units"
            },
            {
                key: "pendingInvites",
                label: "Pending Invites",
                value: number,
                trend: "xx expiring soon"
            }
        ]
    }

- Create [GET] /members/:id/analytics
response:
    {
        status: boolean,
        message: string,
        data: {
            totalRepository: number,
            totalDeployment: number
        }
    }