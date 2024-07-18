import ERC20 from './ERC20.json'

const Web3 = require('web3')

let erc20Contract

export function getERC20Events(web3: any) {
    if (erc20Contract === undefined) {
        erc20Contract = new web3.eth.Contract(ERC20.abi, '0x0000000000000000000000000000000000000000');
    }

    return erc20Contract._jsonInterface.filter((o: any) => o.type === 'event');
}

export function analyzeLog(web3: any, events: any[], log: any) {
    for (const ev of events) {
        if (log.topics[0] === ev.signature) {
            try {
                const r = web3.eth.abi.decodeLog(ev.inputs, log.data, log.topics.slice(1));
                return { ...r, name: ev.name };
            } catch (err) {
                return { name: ev.name };
            }
        }
    }
}

export function decodeTxLogs(web3: any, abi: any[], logs: any[]) {
    const contract = new web3.eth.Contract(abi, '0x0000000000000000000000000000000000000000');

    const events = contract._jsonInterface.filter((o: any) => o.type === 'event');

    let ret = [];
    for (const ev of events) {
        const lg = logs.find((g: any) => g.topics[0] === ev.signature);
        if (lg) {
            const r = web3.eth.abi.decodeLog(ev.inputs, lg.data, lg.topics.slice(1));
            ret = [...ret, { ...r, name: ev.name }];
        }
    }

    return ret;
}

export function decodeTxInput(web3: any, abi: any[], input: string) {
    const contract = new web3.eth.Contract(abi, '0x0000000000000000000000000000000000000000');
    const fns = contract._jsonInterface.filter((o: any) => o.type === 'function');
    if (input.slice(0, 2) === '0x') input = input.slice(2)

    let decoded
    let fnTx
    for (const fn of fns) {
        if (fn.signature.toLowerCase() === '0x' + input.slice(0, 8).toLowerCase()) {
            try {
                decoded = web3.eth.abi.decodeParameters(fn.inputs, '0x' + input.slice(8));
                fnTx = fn;
                break
            } catch (err) {
            }
        }
    }

    if (decoded) {
        return {
            decoded,
            abi: fnTx
        }
    }
}
