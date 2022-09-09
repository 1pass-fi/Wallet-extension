import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NFTMedia from 'finnie-v2/components/NFTMedia'
import AddIcon from 'img/v2/select-nfts/add-icon.svg'
import CheckIcon from 'img/v2/select-nfts/check-icon.svg'
import { setSelectedNftIds } from 'options/actions/selectedNftIds'

const NftSelectCard = ({ nft }) => {
  const dispatch = useDispatch()
  const selectedNftIds = useSelector((state) => state.selectedNftIds)

  const handleToggleSelectNft = () => {
    if (selectedNftIds.includes(nft.txId)) {
      dispatch(setSelectedNftIds((prev) => prev.filter((id) => id !== nft.txId)))
    } else {
      dispatch(setSelectedNftIds((prev) => [...prev, nft.txId]))
    }
  }

  return (
    <div className="relative text-white rounded bg-blue-800 w-46.75 h-48.5 pt-1.75 px-1.75 cursor-pointer">
      <div className="absolute w-6 h-6 top-4 right-4 z-10">
        {selectedNftIds.includes(nft.txId) ? <CheckIcon /> : <AddIcon />}
      </div>
      <div className="flex justify-center items-center w-full h-36" onClick={handleToggleSelectNft}>
        <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
      </div>
      <div className="pl-1.75 flex flex-col mt-2 gap-y-1">
        <div className="font-semibold text-xs tracking-finnieSpacing-wide h-8 text-ellipsis overflow-hidden">
          {nft.name}
        </div>
      </div>
    </div>
  )
}

export default NftSelectCard
