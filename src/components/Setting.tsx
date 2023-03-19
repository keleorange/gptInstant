import { useState } from "react";

interface IStore {
    API_KEY?: string;
    temperature?: number;
    API_PROXY?: string;
}

interface IProps {
    onClose: () => void;
}
export function Setting({onClose}: IProps) {
    const s = JSON.parse(localStorage.getItem('setting') || '{}') as IStore;

    const [store, setStore] = useState<IStore>(s);

    function handleKeyChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStore({...store, 'API_KEY': e.target.value});
    }

    function handleProxyChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStore({...store, 'API_PROXY': e.target.value});
    }

    function handleTemperatureChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStore({...store, 'temperature': Number(e.target.value || '0.75')});
    }

    function handleSubmit() {
        localStorage.setItem('setting', JSON.stringify(store));
        onClose();
    }

    return (
        <div id="staticModal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className="fixed top-20 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
            <div className="relative p-3 transform overflow-hidden rounded-lg bg-slate-500 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="mb-2">
                    <label htmlFor="API_KEY" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">API 密钥</label>
                    <input onChange={handleKeyChange} value={store.API_KEY} type="text" id="API_KEY" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="sk_xxxxxxxxxxxx" required/>
                </div>
                <div className="mb-2">
                    <label htmlFor="API_PROXY" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">API 代理</label>
                    <input onChange={handleProxyChange} value={store.API_PROXY} type="text" id="API_PROXY" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://openai.com" required/>
                </div>
                <div className="mb-2">
                    <label htmlFor="MODEL" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">模型</label>
                    <select id="MODEL" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    </select>                
                </div>
                <div className="mb-2">
                    <label htmlFor="temperature" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">温度</label>
                    <input onChange={handleTemperatureChange} value={store.temperature} type="number" id="temperature" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0.75" required/>
                </div>
                <button onClick={handleSubmit} className="bg-cyan-500 text-white h-full rounded-lg shadow-sm px-4 py-1 ml-1 disabled:opacity-50">Save</button>
            </div>
        </div>

    )
}