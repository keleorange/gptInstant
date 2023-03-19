import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { useClickOutside } from "../hooks";

interface IProps {
    onClearSession: () => void;
    onSetting: () => void;
}
export function Header({ onClearSession, onSetting }: IProps) {
    const [showSetting, setShowSetting] = useState(false);;
    function handleSetting(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setShowSetting(!showSetting);
        if(!localStorage.getItem('setting')) {
            localStorage.setItem('setting', JSON.stringify({'API_KEY': '', temperature: 0.75, top_p: 0.95, max_tokens: 200}));
        }
    }

    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => {
        if(showSetting) {
            setShowSetting(false);
        }
    });

    return (
        <div className="relative">
            <h1 className="text-center">GPT Instant</h1>
            <span className="active:bg-slate-700 w-8 h-8 absolute right-1 -top-1 rounded-sm flex items-center justify-center">
                <FontAwesomeIcon icon={faEllipsis} className=" " onClick={handleSetting}/>
            </span>
            {showSetting && <div ref={ref} className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                <div className="py-1" role="none">
                    <a href="#" className=" block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-0" onClick={onSetting}>Settings</a>
                    <a href="#" className=" block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-1" onClick={onClearSession}>Clear Session</a>
                </div>
            </div>}
        </div>
    )
}