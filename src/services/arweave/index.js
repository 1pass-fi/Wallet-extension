import Arweave from 'arweave/node'
// import { Web } from '@_koi/sdk/web'
const Web = () => ({})

export const koiTools = new Web()

export const KoiTool = Web
export default Arweave.init({ host: 'arweave.net', protocol: 'https', port: 443 })
