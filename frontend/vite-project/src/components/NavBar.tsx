export function NavBar({ 
        onLogout,
        dispName   
     }: { 
        onLogout: () => void;
        dispName: string | null;
      } 
    ) 

{
    return(
        <div>
            <nav>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/projects">Projects</a></li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a>{dispName ? dispName: "userName"}</a></li>
                </ul>
            </nav>
            <button onClick={onLogout}>Logout</button>
            
        </div>
    );

}
