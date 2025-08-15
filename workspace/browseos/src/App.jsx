
import { useState } from 'react';

const APPS = [
  { id: 'notes', name: 'Notes', icon: '📝' },
  { id: 'calc', name: 'Calculator', icon: '🧮' },
  { id: 'browser', name: 'Web Browser', icon: '🌐' },
];

function NotesApp() {
  const [text, setText] = useState('');
  return (
    <div className="p-4 h-full flex flex-col">
      <textarea
        className="flex-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white resize-none outline-none"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your notes here..."
      />
    </div>
  );
}

function CalculatorApp() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const handleClick = val => setInput(input + val);
  const handleClear = () => { setInput(''); setResult(''); };
  const handleEquals = () => {
    try {
      // eslint-disable-next-line no-eval
      setResult(eval(input).toString());
    } catch {
      setResult('Error');
    }
  };
  return (
    <div className="p-4 flex flex-col gap-2">
      <input className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white mb-2" value={input} readOnly />
      <div className="grid grid-cols-4 gap-2">
        {[7,8,9,'/'].map(v => <button key={v} className="btn" onClick={()=>handleClick(v.toString())}>{v}</button>)}
        {[4,5,6,'*'].map(v => <button key={v} className="btn" onClick={()=>handleClick(v.toString())}>{v}</button>)}
        {[1,2,3,'-'].map(v => <button key={v} className="btn" onClick={()=>handleClick(v.toString())}>{v}</button>)}
        {[0,'.','=','+'].map(v => v==='='
          ? <button key={v} className="btn col-span-2 bg-blue-500 text-white" onClick={handleEquals}>=</button>
          : <button key={v} className="btn" onClick={()=>handleClick(v.toString())}>{v}</button>
        )}
      </div>
      <div className="mt-2 text-right text-lg font-bold">{result}</div>
      <button className="btn bg-red-500 text-white mt-2" onClick={handleClear}>Clear</button>
    </div>
  );
}

function BrowserApp() {
  const [url, setUrl] = useState('https://www.example.com');
  const [input, setInput] = useState(url);
  return (
    <div className="flex flex-col h-full">
      <form className="flex gap-2 p-2" onSubmit={e => { e.preventDefault(); setUrl(input); }}>
        <input className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white" value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter URL..." />
        <button className="btn bg-blue-500 text-white" type="submit">Go</button>
      </form>
      <iframe src={url} title="Web Browser" className="flex-1 w-full rounded-b-lg border-0" />
    </div>
  );
}

const APP_COMPONENTS = {
  notes: NotesApp,
  calc: CalculatorApp,
  browser: BrowserApp,
};

function Window({ app, onClose, zIndex, isActive, onClick }) {
  const AppComponent = APP_COMPONENTS[app.id];
  return (
    <div
      className={`absolute top-24 left-24 w-[400px] h-[400px] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col ${isActive ? 'ring-4 ring-blue-400' : ''}`}
      style={{ zIndex }}
      onMouseDown={onClick}
    >
      <div className="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-800 rounded-t-lg cursor-move select-none">
        <span className="font-semibold">{app.icon} {app.name}</span>
        <button className="btn bg-red-500 text-white px-2 py-1" onClick={onClose}>✕</button>
      </div>
      <div className="flex-1 overflow-hidden">
        <AppComponent />
      </div>
    </div>
  );
}

function App() {
  const [windows, setWindows] = useState([]);
  const [zOrder, setZOrder] = useState([]);
  const openApp = appId => {
    const id = `${appId}-${Date.now()}`;
    setWindows(wins => [...wins, { id, app: APPS.find(a=>a.id===appId) }]);
    setZOrder(order => [...order, id]);
  };
  const closeApp = id => {
    setWindows(wins => wins.filter(w => w.id !== id));
    setZOrder(order => order.filter(z => z !== id));
  };
  const focusApp = id => setZOrder(order => [...order.filter(z => z !== id), id]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Wallpaper */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{backgroundImage:'linear-gradient(135deg,#a1c4fd 0%,#c2e9fb 100%)'}} />

      {/* Windows */}
      {windows.map((w, i) => (
        <Window
          key={w.id}
          app={w.app}
          onClose={() => closeApp(w.id)}
          zIndex={100 + zOrder.indexOf(w.id)}
          isActive={zOrder[zOrder.length-1] === w.id}
          onClick={() => focusApp(w.id)}
        />
      ))}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 w-full h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur flex items-center px-4 gap-4 shadow-t z-50">
        <div className="flex gap-2">
          {APPS.map(app => (
            <button
              key={app.id}
              className="btn flex flex-col items-center justify-center px-4 py-2 text-sm font-medium"
              onClick={() => openApp(app.id)}
            >
              <span className="text-2xl">{app.icon}</span>
              {app.name}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs text-gray-500 dark:text-gray-300">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default App;
