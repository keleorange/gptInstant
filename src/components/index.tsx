interface IChat {
    role: TRole;
    message: string;
}
export function UserChat({message}: IChat) {
    return (
        <div className="flex justify-end mb-4">
            <div className="mr-2 py-3 px-4 break-all bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                {message}
            </div>
        </div>
    )
}

export function GPTChat({message}: IChat) {
    return (
        <div className="flex justify-start mb-4">
            <div className="ml-2 py-3 px-4 break-all bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                {message}
            </div>
        </div>
    )
}

export function Chat({role, message}: IChat) {
    return role === 'user' ? <UserChat role={role} message={message}/> : <GPTChat role={role} message={message}/>
}