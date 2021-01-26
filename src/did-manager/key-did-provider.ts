import { IIdentifier, IKey, IService, IAgentContext, IKeyManager } from '@veramo/core'
import { AbstractIdentifierProvider } from '@veramo/did-manager'
import Debug from 'debug'
import Multibase from 'multibase'
import Multicodec from 'multicodec'

const debug = Debug('veramo:did-key:identifier-provider')

type IContext = IAgentContext<IKeyManager>

/**
 * @alpha
 */
export class KeyDidProvider extends AbstractIdentifierProvider {
  private defaultKms: string

  constructor(options: { defaultKms: string }) {
    super()
    this.defaultKms = options.defaultKms
  }

  async createIdentifier(
    { kms, options }: { kms?: string; options?: any },
    context: IContext,
  ): Promise<Omit<IIdentifier, 'provider'>> {

    const key = await context.agent.keyManagerCreate({ kms: kms || this.defaultKms, type: 'Ed25519' })

    const methodSpecificId = Buffer.from(Multibase.encode('base58btc', 
      Multicodec.addPrefix('ed25519-pub', Buffer.from(key.publicKeyHex, 'hex')))).toString()

    const identifier: Omit<IIdentifier, 'provider'> = {
      did: 'did:key:' + methodSpecificId,
      controllerKeyId: key.kid,
      keys: [key],
      services: [],
    }
    debug('Created', identifier.did)
    return identifier    
  }

  async deleteIdentifier(identifier: IIdentifier, context: IContext): Promise<boolean> {
    for (const { kid } of identifier.keys) {
      await context.agent.keyManagerDelete({ kid })
    }
    return true
  }

  async addKey(
    { identifier, key, options }: { identifier: IIdentifier; key: IKey; options?: any },
    context: IContext,
  ): Promise<any> {
    throw Error('IdentityProvider deleteIdentity not implemented')
  }

  async addService(
    { identifier, service, options }: { identifier: IIdentifier; service: IService; options?: any },
    context: IContext,
  ): Promise<any> {
    throw Error('IdentityProvider deleteIdentity not implemented')
  }

  async removeKey(
    args: { identifier: IIdentifier; kid: string; options?: any },
    context: IContext,
  ): Promise<any> {
    throw Error('IdentityProvider deleteIdentity not implemented')
  }

  async removeService(
    args: { identifier: IIdentifier; id: string; options?: any },
    context: IContext,
  ): Promise<any> {
    throw Error('IdentityProvider deleteIdentity not implemented')
  }
}