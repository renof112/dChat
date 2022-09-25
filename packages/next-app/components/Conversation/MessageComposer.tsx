import React, { useEffect, useState, useContext, Fragment } from 'react'
import { classNames } from '../../helpers'
import messageComposerStyles from '../../styles/MessageComposer.module.css'
import upArrowGreen from '../../public/up-arrow-green.svg'
import upArrowGrey from '../../public/up-arrow-grey.svg'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import { WalletContext } from '../../contexts/wallet'
import { create, NxtpSdkConfig } from "@connext/nxtp-sdk"
import { ethers, Contract } from "ethers"
import { text } from 'node:stream/consumers'
import Loader from '../Loader'

const abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_upgradedAddress","type":"address"}],"name":"deprecate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"deprecated","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_evilUser","type":"address"}],"name":"addBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradedAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maximumFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_maker","type":"address"}],"name":"getBlackListStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newBasisPoints","type":"uint256"},{"name":"newMaxFee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"basisPointsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isBlackListed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_clearedUser","type":"address"}],"name":"removeBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_UINT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_blackListedUser","type":"address"}],"name":"destroyBlackFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAddress","type":"address"}],"name":"Deprecate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"feeBasisPoints","type":"uint256"},{"indexed":false,"name":"maxFee","type":"uint256"}],"name":"Params","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_blackListedUser","type":"address"},{"indexed":false,"name":"_balance","type":"uint256"}],"name":"DestroyedBlackFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"AddedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"RemovedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"}];

type MessageComposerProps = {
  onSend: (msg: string) => Promise<void>
}

const MessageComposer = ({ onSend }: MessageComposerProps): JSX.Element => {
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    address: walletAddress,
    signer,
  } = useContext(WalletContext)

  useEffect(() => setMessage(''), [router.query.recipientWalletAddr])

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const onMessageChange = (e: React.FormEvent<HTMLInputElement>) =>
    setMessage(e.currentTarget.value)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message) {
      return
    }
    setMessage('')
    await onSend(message)
  }

  const onTransfer = async () => {
    try {
      setLoading(true);
      const signerAddress = await signer.getAddress();
      const recipientWalletAddr = router.query.recipientWalletAddr as string;
      const nxtpConfig: NxtpSdkConfig = {
        logLevel: "info",
        signerAddress: signerAddress,
        chains: {
          "1735353714": {
              providers: [process.env.GOERLI_RPC_URL as any],
              assets: [
              {
                  name: "TEST",
                  symbol: "TEST",
                  address: "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1",
              },
              ],
          },
          "1735356532": {
              providers: [process.env.OPTIMISM_GOERLI_RPC_URL as any],
              assets: [
              {
                  name: "TEST",
                  symbol: "TEST",
                  address: "0x68Db1c8d85C09d546097C65ec7DCBFF4D6497CbF",
              },
              ],
          },
        },
      };
      const {nxtpSdkBase} = await create(nxtpConfig);
      const callParams = {
        to: recipientWalletAddr,
        callData: "0x",
        originDomain: "1735353714",
        destinationDomain: "1735356532",
        agent: signerAddress,
        recovery: signerAddress,
        forceSlow: false,
        receiveLocal: false,
        callback: ethers.constants.AddressZero,
        callbackFee: "0",
        relayerFee: "0",
        destinationMinOut: (ethers.utils.parseEther((parseFloat(amount)*0.97).toString())).toString(),
      };
      const xCallArgs = {
        params: callParams,
        transactingAsset: "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1",
        transactingAmount: (ethers.utils.parseEther(amount)).toString(), 
        originMinOut: (ethers.utils.parseEther((parseFloat(amount)*0.97).toString())).toString()
      };
      // const approveTxReq = await nxtpSdkBase.approveIfNeeded(
      //   xCallArgs.params.originDomain,
      //   xCallArgs.transactingAsset,
      //   xCallArgs.transactingAmount
      // )
      if (await (window as any)?.ethereum?.request({ method: 'eth_chainId' }) != '0x5') {
        await (window as any)?.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
        });
      }
      const test = new Contract("0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1", abi, signer);
      const tx = await test.approve("0xD9e8b18Db316d7736A3d0386C59CA3332810df3B", ethers.utils.parseEther(((parseFloat(amount))*1.1).toString()));
      await tx.wait();
      // const approveTxReceipt = await signer.sendTransaction(approveTxReq);
      // await approveTxReceipt.wait();
      const xcallTxReq = await nxtpSdkBase.xcall(xCallArgs);
      xcallTxReq.gasLimit = ethers.BigNumber.from("20000000"); 
      const xcallTxReceipt = await signer.sendTransaction(xcallTxReq);
      const xcallResult = await xcallTxReceipt.wait();
      const hash = xcallResult?.transactionHash;
      const tracklink = `Track the xcall at https://testnet.amarok.connextscan.io/tx/${hash}`;
      const transferMessage = `Sent ${amount} TEST tokens from Goerli to Optimism-Goerli. ${tracklink}`;
      setLoading(false);
      closeModal();
      await onSend(transferMessage);
    } catch(error) {
      setLoading(false);
      closeModal();
      window.alert("Error occured")
    }
  }

  return (
    <div
      className={classNames(
        'sticky',
        'bottom-0',
        'pl-4',
        'pt-2',
        'flex-shrink-0',
        'flex',
        'h-[68px]',
        'bg-white'
      )}
    >
      <form
        className={classNames(
          'flex',
          'w-full',
          'border',
          'py-2',
          'pl-4',
          'mr-3',
          messageComposerStyles.bubble
        )}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Type something..."
          className={classNames(
            'block',
            'w-full',
            'text-md',
            'md:text-sm',
            messageComposerStyles.input
          )}
          name="message"
          value={message}
          onChange={onMessageChange}
          required
        />
        <button type="submit" className={messageComposerStyles.arrow}>
          <img
            src={message ? upArrowGreen : upArrowGrey}
            alt="send"
            height={32}
            width={32}
          />
        </button>
      </form>
      <div className='mr-3'>
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-blue-500 px-4 py-2 text-lg font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Transfer
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Cross chain transfer
                  </Dialog.Title>
                  <br/>
                  {!loading 
                    ? <div>
                      <label htmlFor="from">Origin Chain</label>
                      <select name="from" id="from" className='ml-20 px-3 py-1 pr-8 mb-2'>
                        <option value="goerli">Goerli</option>
                      </select>
                      <br/>
                      <label htmlFor="to">Destination Chain</label>
                      <select name="to" id="to" className='ml-10 px-3 py-1 pr-8 mt-2'>
                        <option value="opt-goerli">Optimism-Goerli</option>
                      </select>
                      <br/><br/>
                      <label htmlFor="amount">Amount</label>
                      <input
                        type="text"
                        id="amount"
                        name="amount"
                        value={amount?.toString()}
                        placeholder="Amount of TEST tokens"
                        className="bg-white-100 px-[10px] py-[7px] mt-[10px] rounded max-w-[400px] w-full text-black border-2 border-black"
                        onChange={e => setAmount(e.target.value)}
                      />

                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Seamless cross-chain payments
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onTransfer}
                      >
                        Transfer
                      </button>
                      </div>
                    : <Loader
                        headingText="Creating xcall..."
                        subHeadingText="Use your wallet to send transaction"
                        isLoading
                      />
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default MessageComposer
