import { Config } from '~/config';

/**
 * Url structure: {domain}{prefix}{image_url}{suffix}{extension}
 *
 * @see [documentation]{@link https://simkl.docs.apiary.io/#introduction/about-simkl-api/images}
 **/
export const SimklApiImages = {
  Endpoint: Config.Images,
  Prefix: {
    Poster: 'posters',
    Fanart: 'fanart',
    Episode: 'episodes',
    Avatars: 'avatars',
    Comments: 'comments',
  } as const,
  Suffix: {
    Poster: {
      /** 600x338 */
      Wide: '_w',
      /** 340x * */
      Large: '_m',
      /** 190x279(285) */
      Medium: '_ca',
      /** 170x250(256) */
      Small: '_c',
      /** 84x124 */
      Tiny: '_cm',
      /** 40x57 */
      Thumb: '_s',
    } as const,
    Fanart: {
      /** (darker, small KB)	* x * (original size) */
      Darker: '_d',
      /** 1920x1080 */
      FullHD: '_medium',
      /** 960x540 */
      Mobile: '_mobile',
      /** 600x338 */
      Wide: '_w',
      /** 48x27 */
      Thumb: '_s48',
    } as const,
    Episode: {
      /** 600x338 */
      Wide: '_w',
      /** 210x118 */
      Small: '_c',
      /** 112x63 */
      Thumb: '_m',
    } as const,
    Avatars: {
      /** 24x24 */
      w24: '_24',
      /** 100x100 */
      w100: '_100',
      /** 200x200 */
      w200: '',
      /** 256x256 */
      w256: '_256',
      /** 512x512 */
      w512: '_512',
    } as const,
  } as const,
} as const;

export type SimklApiImagePrefix = (typeof SimklApiImages)['Prefix'][keyof (typeof SimklApiImages)['Prefix']];
export type SimklApiImageSuffix = (typeof SimklApiImages)['Suffix'][keyof (typeof SimklApiImages)['Suffix']];
export type SimklApiImageExtension = '.jpg' | '.webp';

/**
 * Url structure: {domain}{prefix}{image_url}{suffix}{extension}
 *
 * The images with the same URL never change.
 * Do not re-download the same image multiple times.
 * We recommend caching the images on your server.
 *
 * @see [documentation]{@link https://simkl.docs.apiary.io/#introduction/about-simkl-api/images}
 **/
export const getSimklImageUrl = ({
  url,
  prefix,
  suffix,
  extension,
}: {
  url: string;
  prefix: SimklApiImagePrefix;
  suffix: SimklApiImageSuffix;
  extension: SimklApiImageExtension;
}) => new URL([SimklApiImages.Endpoint, prefix, url, suffix, extension].join('/'));
