import type { NextPage } from 'next'
import React, { useState, useContext, Fragment } from 'react'
import { WalletContext } from '../../contexts/wallet'
import { Dialog, Transition } from '@headlessui/react'
import Loader from '../../components/Loader'
import { ethers } from 'ethers'

const Group: NextPage = () => {
  const {
    address: walletAddress
  } = useContext(WalletContext)
  const [isOpen, setIsOpen] = useState(true)

  const [collection, setCollection] = useState('')
  const [loading, setLoading] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const checkAccess = async () => {
    setLoading(true)
    const provider = new ethers.providers.JsonRpcProvider(process.env.QUICKNODE_RPC_URL);
    const heads = await provider.send("qn_fetchNFTs", [{
      wallet: walletAddress,
    }]);
    if (heads?.assets?.length > 0) {
      // eslint-disable-next-line
      const as = heads?.assets?.find((a:any) => a?.collectionAddress == collection);
      if (as) {
        alert("Access granted. Welcome to exclusive chat!");
        closeModal();
      } else {
        alert("Access denied. You do not own an NFT from this collection");
      }
    } else {  
      alert("Access denied. You do not own an NFT from this collection");
    }
    setLoading(false)
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Check Access
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
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    NFT-gated access Chat
                  </Dialog.Title>
                  <br/>
                  {!loading 
                  ? <Fragment>
                      <div className="mt-2">
                        <label htmlFor="collection">NFT Collection</label>
                        <input
                          type="text"
                          id="collection"
                          name="collection"
                          value={collection}
                          placeholder="Enter NFT contract address"
                          className="bg-white-100 px-[10px] py-[7px] mt-[10px] rounded max-w-[400px] w-full text-black border-2 border-black"
                          onChange={e => setCollection(e.target.value)}
                        />
                      </div>
                      <br/>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-md font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={checkAccess}
                        >
                          Check Access
                        </button>
                      </div>
                    </Fragment>
                  : <Loader
                      headingText="Querying API..."
                      subHeadingText="Checking NFT ownership"
                      isLoading
                    />
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Group
