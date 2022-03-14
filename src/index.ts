import * as CrytoJS from 'crypto-js'

class Block {
    
    // static을 사용해서 클래스 밖에서도 함수 사용할 수 있게 설정
    static calculateBlockHash = (  
        index: number,
        preHash: string,
        timestamp: number,
        data: string
        ): string => CrytoJS.SHA256(index + preHash + timestamp + data).toString()
        
        static validateStructure = (aBlock: Block) : boolean => 
        typeof aBlock.index === "number" && 
        typeof aBlock.hash === "string" && 
        typeof aBlock.preHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string" 
        
        public index: number
        public hash: string
        public preHash: string
        public data: string
        public timestamp: number

    constructor(
        index: number,
        hash: string,
        preHash: string,
        data: string,
        timestamp: number){
            this.index = index
            this.hash = hash
            this.preHash = preHash
            this.data = data
            this.timestamp = timestamp
        } 
}

const genesisBlock: Block = new Block(0, "20202020202020", "", "Hello", 123456)

let blockchain: Block[] = [genesisBlock]

const getBlockchain = (): Block[] => blockchain

const getLatesBlock = (): Block => blockchain[blockchain.length - 1]

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000)

const createNewBlock = (data: string): Block => {
    const preBlock : Block = getLatesBlock()
    const newIndex : number = preBlock.index + 1
    const newTimestamp : number = getNewTimeStamp()
    const newHash : string = Block.calculateBlockHash(
        newIndex, 
        preBlock.hash, 
        newTimestamp,
        data)
    const newBlock : Block = new Block(
        newIndex, 
        newHash, 
        preBlock.hash, 
        data, 
        newTimestamp
    )
    addBlock(newBlock) 
    return newBlock
}

const getHashforBlock = (aBlock: Block) :string => Block.calculateBlockHash(aBlock.index, aBlock.preHash, aBlock.timestamp, aBlock.data)


const isBlockValid = (
    candidateBlock: Block,
    preBlock: Block
): boolean => {
    if(!Block.validateStructure(candidateBlock)) {
        return false
    } else if(preBlock.index + 1 !== candidateBlock.index){
        return false
    } else if(preBlock.hash !== candidateBlock.preHash) {
        return false
    } else if(getHashforBlock(candidateBlock) !== candidateBlock.hash){
        return false
    } else {
        return true
    }
}
 
const addBlock = (candidateBlock: Block) : void => {
    if(isBlockValid(candidateBlock, getLatesBlock())){
        blockchain.push(candidateBlock)
    }
}

createNewBlock("second block")
createNewBlock("third block")
createNewBlock("fourth block")

console.log(blockchain)
export {}