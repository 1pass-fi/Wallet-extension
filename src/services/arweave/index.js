import Arweave from 'arweave'
import { Web } from '@_koi/sdk/web'

export const koiTools = new Web()
export default Arweave.init({ host: 'arweave.net', protocol: 'https', port: 443, })
