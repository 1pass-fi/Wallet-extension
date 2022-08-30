import { useEffect,useState } from 'react'

export default () => {
  /* 
    Modal state
  */
  const [pendingNFTTitle, setPendingNFTTitle] = useState('') // title of new NFT to show on modal
  const [showUploadingModal, setShowUploadingModal] = useState(false) // show uploading modal on top
  const [showSuccessUploadModal, setShowSuccessUploadModal] = useState(false) // show success upload modal on top
  const [showUploadedIcon, setShowUploadedIcon] = useState(false) // show updated Icon on top
  const [showTransferNFT, setShowTransferNFT] = useState({ show: false }) // to show transfer modal
  const [showShareModal, setShowShareModal] = useState({
    show: false,
    txid: null,
  }) // show share modal for big NFT content
  const [showExportModal, setShowExportModal] = useState({}) // show bridge modal
  const [showSelectAccount, setShowSelectAccount] = useState(false) // choose account on upload nft

  useEffect(() => {
    if (showSuccessUploadModal) {
      const timer = setTimeout(() => setShowSuccessUploadModal(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessUploadModal])

  useEffect(() => {
    if (showUploadedIcon) {
      const timer = setTimeout(() => setShowUploadedIcon(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showUploadedIcon])

  return [
    {
      pendingNFTTitle,
      showUploadingModal,
      showSuccessUploadModal,
      showUploadedIcon,
      showTransferNFT,
      showShareModal,
      showExportModal,
      showSelectAccount
    },
    {
      setPendingNFTTitle,
      setShowUploadingModal,
      setShowSuccessUploadModal,
      setShowUploadedIcon,
      setShowTransferNFT,
      setShowShareModal,
      setShowExportModal,
      setShowSelectAccount
    }
  ]
}
