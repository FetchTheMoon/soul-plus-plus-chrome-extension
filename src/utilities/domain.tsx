import { fromUrl, parseDomain, ParseResultType } from 'parse-domain';

export function getHostname(domain: string): string | undefined {
    const parseResult = parseDomain(fromUrl(domain));
    if (parseResult.type === ParseResultType.Listed && parseResult.domain) {
        return parseResult.hostname;
    } else {
        return undefined;
    }
}