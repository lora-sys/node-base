// 测试 undici 全局代理配置
import { setGlobalDispatcher, ProxyAgent } from 'undici';

const proxyAgent = new ProxyAgent('http://192.168.3.85:7897');
setGlobalDispatcher(proxyAgent);

console.log('Global undici dispatcher set to proxy');
