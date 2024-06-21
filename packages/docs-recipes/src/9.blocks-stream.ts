import { Torii, ToriiRequirementsForApiWebSocket } from '@iroha2/client'
import { datamodel } from '@iroha2/data-model'

declare const requirements: ToriiRequirementsForApiWebSocket

const stream = await Torii.listenForBlocksStream(requirements, {
  fromBlockHeight: datamodel.NonZero.define(1n),
})

stream.ee.on('block', (block) => {
  const height = block.as('V1').payload.header.height
  console.log('Got block with height', height)
})
