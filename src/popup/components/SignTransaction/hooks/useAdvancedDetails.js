import { useEffect, useState } from 'react'
import { 
  decodeInitializeMintInstructionUnchecked,
  decodeInitializeMultisigInstructionUnchecked,
} from '@solana/spl-token'
import { Message, Transaction } from '@solana/web3.js'
import base58 from 'bs58'
import { DAPP_ORIGIN, SOLANA_PROGRAM_ID } from 'constants/koiConstants'
import isEmpty from 'lodash/isEmpty'

const decodeSolseaInstructions = (instructions) => {
  if (instructions.length === 2) {
    const instructionOne = instructions[0]
    const instructionTwo = instructions[1]

    const decodedInstructionOne = decodeInitializeMintInstructionUnchecked(instructionOne)
    const oneRent = decodedInstructionOne.keys.rent.pubkey.toString()

    const instructionTwoProgramId = instructionTwo.programId.toString()

    return [
      {
        title: 'Create account',
        'New Account': oneRent,
        'Amount': '0.00507 SOL'
      },
      {
        title: 'Unknown',
        'Program Id' : instructionTwoProgramId,
      }
    ]
  }

  if (instructions.length === 3) {
    const instructionOne = instructions[0]
    const instructionThree = instructions[2]

    const decodedInstructionOne = decodeInitializeMintInstructionUnchecked(instructionOne)
    const instructionOneMint = decodedInstructionOne.keys.mint.pubkey.toString()
    const instructionOneRent = decodedInstructionOne.keys.rent.pubkey.toString()

    const decodedInstructionThree = decodeInitializeMultisigInstructionUnchecked(instructionThree)
    const instructionTreeProgramId = decodedInstructionThree.programId.toString()

    return [
      {
        title: 'Create account',
        'New Account': instructionOneRent,
        'Amount': '0.00024 SOL'
      },
      {
        title: 'Initialize account',
        'Account': instructionOneRent,
        'Mint': '0.00024 SOL',
        'Owner': instructionOneMint
      },
      {
        title: 'Unknown',
        'Program Id': instructionTreeProgramId,
      }
    ]
  }

  return []
}


/* 
  Supported transactions:
  - from Solsea
  - transfering sol
  - transfering custom token

  fallback: empty instruction array
*/
const useAdvancedDetails = ({ message, origin }) => {
  const [textInstructions, setTextInstructions] = useState([])

  useEffect(() => {
    const loadInstructions = async () => {
      try {
        const decodedMessage = Message.from(base58.decode(message))

        const transaction = Transaction.populate(decodedMessage)
        const instructions = transaction.instructions

        if (origin === DAPP_ORIGIN.SOLSEA) {
          const textInstructions = decodeSolseaInstructions(instructions)
          setTextInstructions(textInstructions)
          return
        }

        /* Do not support random multiple instructions transaction */
        if (instructions.length > 1) {
          setTextInstructions([])
          return
        }

        const programId = instructions[0].programId.toString()
        if (programId === SOLANA_PROGRAM_ID.SYSTEM_PROGRAM) {
          try {
            // TODO: transfer sol
          } catch (err) {
            console.error('Decode transfering sol error:', err)
            setTextInstructions([])
            return
          }
        }

        if (programId === SOLANA_PROGRAM_ID.TOKEN_PROGRAM_ID) {
          try {
            // TODO: transfer custom token
          } catch (err) {
            console.log('Decode transfering token error:', err)
            setTextInstructions([])
            return
          }
        }

        setTextInstructions([])
      } catch (err) {
        console.error('loadInstructions error:', err)
        setTextInstructions([])
      }
    }

    if (!isEmpty(message)) loadInstructions()
  }, [message])

  return { textInstructions }
}

export default useAdvancedDetails
