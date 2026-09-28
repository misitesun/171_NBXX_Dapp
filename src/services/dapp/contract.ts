import type {
    Abi,
    Address,
    TransactionReceipt,
} from 'viem'

import { useDappStore } from '../../stores/dapp/store.ts'
import {
    DAPP_DEFAULT_GAS_PRICE,
    DAPP_ERROR_MESSAGE,
    DAPP_GAS_LIMIT_MULTIPLIER,
    DAPP_MIN_GAS_BALANCE,
    shouldCheckDappGas,
    shouldEstimateDappGas,
} from './config.ts'
import { getDappWalletClient } from './provider.ts'
import { getConnectedDappAddress } from './wallet.ts'
import type {
    DappContractActions,
    DappContractReadOptions,
    DappContractReadParams,
    DappContractWriteOptions,
    DappContractWriteParams,
} from './types.ts'

export async function readDappContract<TResult = unknown, TAbi extends Abi = Abi>({
    address,
    abi,
    functionName,
    args = [],
    account,
}: DappContractReadParams<TAbi>): Promise<TResult> {
    const walletClient = getDappWalletClient()

    return walletClient.readContract({
        address,
        abi,
        functionName,
        args,
        ...(account === undefined ? {} : { account }),
    } as any) as Promise<TResult>
}

export async function estimateDappContractGas<TAbi extends Abi = Abi>({
    address,
    abi,
    functionName,
    args = [],
}: DappContractReadParams<TAbi>): Promise<bigint> {
    const walletClient = getDappWalletClient()
    const account = await getConnectedDappAddress()

    return walletClient.estimateContractGas({
        address,
        abi,
        functionName,
        args,
        account,
    } as any)
}

export async function writeDappContract<TAbi extends Abi = Abi>({
    address,
    abi,
    functionName,
    args = [],
    gas,
    gasPrice,
    value,
}: DappContractWriteParams<TAbi>): Promise<TransactionReceipt> {
    await checkDappGasBalance()

    const walletClient = getDappWalletClient()
    const account = await getConnectedDappAddress()

    useDappStore.getState().setDappLoading(true)

    try {
        const hash = await walletClient.writeContract({
            address,
            abi,
            functionName,
            args,
            account,
            gas,
            gasPrice,
            value,
        } as any)
        const receipt = await walletClient.waitForTransactionReceipt({ hash })

        if (receipt.status === 'reverted') {
            throw new Error(DAPP_ERROR_MESSAGE.contractReverted)
        }

        // TODO(feedback): Show a shared success message after the global feedback module is ready.
        // TODO(feedback): 全局反馈模块完成后，在这里展示统一成功提示。
        return receipt
    } finally {
        useDappStore.getState().setDappLoading(false)
    }
}

export async function writeDappContractWithGas<TAbi extends Abi = Abi>(
    params: DappContractWriteParams<TAbi>,
): Promise<TransactionReceipt> {
    if (!shouldEstimateDappGas()) {
        return writeDappContract(params)
    }

    const estimatedGas = await estimateDappContractGas(params)
    const gas = estimatedGas * DAPP_GAS_LIMIT_MULTIPLIER / 100n

    return writeDappContract({
        ...params,
        gas,
        gasPrice: params.gasPrice ?? DAPP_DEFAULT_GAS_PRICE,
    })
}

export async function checkDappGasBalance(
    minGasBalance: bigint = DAPP_MIN_GAS_BALANCE,
): Promise<bigint> {
    if (!shouldCheckDappGas()) return 0n

    const walletClient = getDappWalletClient()
    const address = await getConnectedDappAddress()
    const balance = await walletClient.getBalance({ address })

    if (balance < minGasBalance) {
        throw new Error(DAPP_ERROR_MESSAGE.gasBalanceInsufficient)
    }

    return balance
}

export function createDappContractActions<TAbi extends Abi>(
    address: Address,
    abi: TAbi,
): DappContractActions {
    return {
        read(functionName, args = [], options: DappContractReadOptions = {}) {
            return readDappContract({
                address,
                abi,
                functionName,
                args,
                ...options,
            })
        },
        write(functionName, args = [], options: DappContractWriteOptions = {}) {
            return writeDappContract({
                address,
                abi,
                functionName,
                args,
                ...options,
            })
        },
        writeWithGas(functionName, args = [], options = {}) {
            return writeDappContractWithGas({
                address,
                abi,
                functionName,
                args,
                ...options,
            })
        },
        estimateGas(functionName, args = []) {
            return estimateDappContractGas({ address, abi, functionName, args })
        },
    }
}
