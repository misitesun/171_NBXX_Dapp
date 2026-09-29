export type ContractAddress = `0x${string}`

export interface NbxxContractEnv {
    VITE_USDT?: string
    VITE_NBXX_NODE?: string
}

export function requireContractAddress(value: string | undefined, name: string): ContractAddress {
    const address = value?.trim()
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address) || /^0x0{40}$/i.test(address)) {
        throw new Error(`Missing or invalid ${name} contract address`)
    }
    // The hexadecimal address has been validated at the configuration boundary.
    return address as ContractAddress
}

export function getNbxxContractAddresses(env: NbxxContractEnv = import.meta.env ?? {}) {
    return {
        usdt: requireContractAddress(env.VITE_USDT, 'USDT'),
        node: requireContractAddress(env.VITE_NBXX_NODE, 'NBXXNode'),
    }
}

export function getNbxxNodeAddress(env: NbxxContractEnv = import.meta.env ?? {}): ContractAddress {
    return requireContractAddress(env.VITE_NBXX_NODE, 'NBXXNode')
}
