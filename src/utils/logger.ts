const getTime = () => {
  const currentDate = new Date();
  const hh = currentDate.getHours();
  const mm = currentDate.getMinutes();
  return `[${hh}:${mm}]`;
};

const logVault = () => {
  const logs: string[] = [];

  const addLog = (log: string) => {
    // console.log(log);
    logs.push(log);
  };

  const addUserRequestLog = ({ username, action }: { username?: string; action: string }) => {
    const log = `${getTime()} - ${logs.length + 1} - ${username || 'null'} - ${action}`;
    addLog(log);
  };

  const addAppLog = ({ name }: { name: string }) => {
    const log = `${getTime()} - error in ${name}`;
    addLog(log);
  };

  const getLogs = () => logs.join('\n');

  return { addUserRequestLog, getLogs, addAppLog };
};

export const logger = logVault();
