import { useContext } from "react";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";
import { AppContext } from "../context/context";

const Dashboard = ({children, activeMenu}) => {
    const {user} = useContext(AppContext)
    return (
        <div>
            <MenuBar activeMenu={activeMenu}/>

            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        {/*Side bar content */}
                        <Sidebar activeMenu={activeMenu}/>
                    </div>

                    <div className="grow mx-5 bg-purple-50/50 min-h-screen">{children}</div>
                </div>
            )}
        </div>
    )
}

export default Dashboard;