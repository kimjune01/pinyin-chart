/**
 * Valid Pinyin Syllables
 *
 * This file contains all valid pinyin syllable combinations in Mandarin Chinese.
 * Each syllable specifies which tones are valid (1-5).
 *
 * Total: ~400 base syllables, ~1,300 syllable-tone combinations
 */

import { getAudioUrl } from '../lib/audio/audioConfig';

export interface PinyinSyllable {
  pinyin: string;        // Base syllable without tone (e.g., "ma")
  initial: string;       // Initial consonant (e.g., "m" or "" for null)
  final: string;         // Final sound (e.g., "a")
  tones: number[];       // Valid tones for this syllable [1, 2, 3, 4, 5]
  audioUrls: Record<number, string>;  // Audio URLs for each tone
}

/**
 * Generate syllable with all metadata
 */
function syllable(pinyin: string, initial: string, final: string, tones: number[]): PinyinSyllable {
  const audioUrls: Record<number, string> = {};
  for (const tone of tones) {
    audioUrls[tone] = getAudioUrl(`${pinyin}${tone}`);
  }

  return { pinyin, initial, final, tones, audioUrls };
}

// Common tones shorthand
const T1234 = [1, 2, 3, 4];        // All four tones
const T123 = [1, 2, 3];
const T234 = [2, 3, 4];

/**
 * Complete list of valid pinyin syllables
 * Organized by initial consonant group
 */
export const PINYIN_SYLLABLES: PinyinSyllable[] = [
  // Null initial (vowel-starting syllables)
  syllable('a', '', 'a', T1234),
  // Note: standalone 'o' is extremely rare and audio not available
  syllable('e', '', 'e', T1234),
  syllable('ai', '', 'ai', T1234),
  syllable('ei', '', 'ei', T1234),
  syllable('ao', '', 'ao', T1234),
  syllable('ou', '', 'ou', T1234),
  syllable('an', '', 'an', T1234),
  syllable('en', '', 'en', T1234),
  syllable('ang', '', 'ang', T1234),
  // Note: standalone 'eng' audio not available
  syllable('er', '', 'er', T234),

  // Labials: b, p, m, f
  syllable('ba', 'b', 'a', T1234),
  syllable('bo', 'b', 'o', T1234),
  syllable('bai', 'b', 'ai', T1234),
  syllable('bei', 'b', 'ei', T1234),
  syllable('bao', 'b', 'ao', T1234),
  syllable('ban', 'b', 'an', T1234),
  syllable('ben', 'b', 'en', T1234),
  syllable('bang', 'b', 'ang', T1234),
  syllable('beng', 'b', 'eng', T1234),
  syllable('bi', 'b', 'i', T1234),
  syllable('bie', 'b', 'ie', T1234),
  syllable('biao', 'b', 'iao', T234),
  syllable('bian', 'b', 'ian', T1234),
  syllable('bin', 'b', 'in', T1234),
  syllable('bing', 'b', 'ing', T1234),
  syllable('bu', 'b', 'u', T1234),

  syllable('pa', 'p', 'a', T1234),
  syllable('po', 'p', 'o', T1234),
  syllable('pai', 'p', 'ai', T1234),
  syllable('pao', 'p', 'ao', T1234),
  syllable('pou', 'p', 'ou', T1234),
  syllable('pan', 'p', 'an', T1234),
  syllable('pen', 'p', 'en', T1234),
  syllable('pang', 'p', 'ang', T1234),
  syllable('peng', 'p', 'eng', T1234),
  syllable('pi', 'p', 'i', T1234),
  syllable('pie', 'p', 'ie', T1234),
  syllable('piao', 'p', 'iao', T1234),
  syllable('pian', 'p', 'ian', T1234),
  syllable('pin', 'p', 'in', T1234),
  syllable('ping', 'p', 'ing', T1234),
  syllable('pu', 'p', 'u', T1234),

  syllable('ma', 'm', 'a', T1234),
  syllable('mo', 'm', 'o', T1234),
  syllable('me', 'm', 'e', T1234),
  syllable('mai', 'm', 'ai', T1234),
  syllable('mei', 'm', 'ei', T1234),
  syllable('mao', 'm', 'ao', T1234),
  syllable('mou', 'm', 'ou', [1, 2, 4]),
  syllable('man', 'm', 'an', T1234),
  syllable('men', 'm', 'en', T1234),
  syllable('mang', 'm', 'ang', T1234),
  syllable('meng', 'm', 'eng', T1234),
  syllable('mi', 'm', 'i', T1234),
  syllable('mie', 'm', 'ie', T1234),
  syllable('miao', 'm', 'iao', T1234),
  syllable('miu', 'm', 'iu', T1234),
  syllable('mian', 'm', 'ian', T1234),
  syllable('min', 'm', 'in', T1234),
  syllable('ming', 'm', 'ing', T1234),
  syllable('mu', 'm', 'u', T1234),

  syllable('fa', 'f', 'a', T1234),
  syllable('fo', 'f', 'o', T234),
  syllable('fei', 'f', 'ei', T1234),
  syllable('fou', 'f', 'ou', T1234),
  syllable('fan', 'f', 'an', T1234),
  syllable('fen', 'f', 'en', T1234),
  syllable('fang', 'f', 'ang', T1234),
  syllable('feng', 'f', 'eng', T1234),
  syllable('fu', 'f', 'u', T1234),

  // Dentals: d, t, n, l
  syllable('da', 'd', 'a', T1234),
  syllable('de', 'd', 'e', T1234),
  syllable('dai', 'd', 'ai', T1234),
  syllable('dei', 'd', 'ei', T1234),
  syllable('dao', 'd', 'ao', T1234),
  syllable('dou', 'd', 'ou', T1234),
  syllable('dan', 'd', 'an', T1234),
  syllable('dang', 'd', 'ang', T1234),
  syllable('deng', 'd', 'eng', T1234),
  syllable('di', 'd', 'i', T1234),
  syllable('die', 'd', 'ie', T1234),
  syllable('diao', 'd', 'iao', T234),
  syllable('diu', 'd', 'iu', T1234),
  syllable('dian', 'd', 'ian', T1234),
  syllable('ding', 'd', 'ing', T1234),
  syllable('du', 'd', 'u', T1234),
  syllable('duo', 'd', 'uo', T1234),
  syllable('dui', 'd', 'ui', T1234),
  syllable('duan', 'd', 'uan', T1234),
  syllable('dun', 'd', 'un', T1234),
  syllable('dong', 'd', 'ong', T1234),

  syllable('ta', 't', 'a', T1234),
  syllable('te', 't', 'e', T1234),
  syllable('tai', 't', 'ai', T1234),
  syllable('tao', 't', 'ao', T1234),
  syllable('tou', 't', 'ou', T1234),
  syllable('tan', 't', 'an', T1234),
  syllable('tang', 't', 'ang', T1234),
  syllable('teng', 't', 'eng', T1234),
  syllable('ti', 't', 'i', T1234),
  syllable('tie', 't', 'ie', T1234),
  syllable('tiao', 't', 'iao', T1234),
  syllable('tian', 't', 'ian', T1234),
  syllable('ting', 't', 'ing', T1234),
  syllable('tu', 't', 'u', T1234),
  syllable('tuo', 't', 'uo', T1234),
  syllable('tui', 't', 'ui', T1234),
  syllable('tuan', 't', 'uan', T1234),
  syllable('tun', 't', 'un', T1234),
  syllable('tong', 't', 'ong', T1234),

  syllable('na', 'n', 'a', T1234),
  syllable('ne', 'n', 'e', T1234),
  syllable('nai', 'n', 'ai', T1234),
  syllable('nei', 'n', 'ei', T1234),
  syllable('nao', 'n', 'ao', T1234),
  syllable('nou', 'n', 'ou', T1234),
  syllable('nan', 'n', 'an', T1234),
  syllable('nen', 'n', 'en', T1234),
  syllable('nang', 'n', 'ang', T1234),
  syllable('neng', 'n', 'eng', T1234),
  syllable('ni', 'n', 'i', T1234),
  syllable('nie', 'n', 'ie', T1234),
  syllable('niao', 'n', 'iao', T1234),
  syllable('niu', 'n', 'iu', T1234),
  syllable('nian', 'n', 'ian', T1234),
  syllable('nin', 'n', 'in', T234),
  syllable('niang', 'n', 'iang', T234),
  syllable('ning', 'n', 'ing', T1234),
  syllable('nu', 'n', 'u', T1234),
  syllable('nuo', 'n', 'uo', T234),
  syllable('nuan', 'n', 'uan', T1234),
  syllable('nong', 'n', 'ong', T1234),
  // Note: nü/nüe audio not available (uses ü character)

  syllable('la', 'l', 'a', T1234),
  syllable('le', 'l', 'e', T1234),
  syllable('lai', 'l', 'ai', T1234),
  syllable('lei', 'l', 'ei', T1234),
  syllable('lao', 'l', 'ao', T1234),
  syllable('lou', 'l', 'ou', T1234),
  syllable('lan', 'l', 'an', T1234),
  syllable('lang', 'l', 'ang', T1234),
  syllable('leng', 'l', 'eng', T1234),
  syllable('li', 'l', 'i', T1234),
  syllable('lia', 'l', 'ia', T1234),
  syllable('lie', 'l', 'ie', T1234),
  syllable('liao', 'l', 'iao', T1234),
  syllable('liu', 'l', 'iu', T1234),
  syllable('lian', 'l', 'ian', T1234),
  syllable('lin', 'l', 'in', T234),
  syllable('liang', 'l', 'iang', T1234),
  syllable('ling', 'l', 'ing', T1234),
  syllable('lu', 'l', 'u', T1234),
  syllable('luo', 'l', 'uo', T1234),
  syllable('luan', 'l', 'uan', T1234),
  syllable('lun', 'l', 'un', T234),
  syllable('long', 'l', 'ong', T1234),
  // Note: lü/lüe audio not available (uses ü character)

  // Gutturals: g, k, h
  syllable('ga', 'g', 'a', T1234),
  syllable('ge', 'g', 'e', T1234),
  syllable('gai', 'g', 'ai', T1234),
  syllable('gei', 'g', 'ei', T1234),
  syllable('gao', 'g', 'ao', T1234),
  syllable('gou', 'g', 'ou', T1234),
  syllable('gan', 'g', 'an', T1234),
  syllable('gen', 'g', 'en', T1234),
  syllable('gang', 'g', 'ang', T1234),
  syllable('geng', 'g', 'eng', T1234),
  syllable('gu', 'g', 'u', T1234),
  syllable('gua', 'g', 'ua', T1234),
  syllable('guo', 'g', 'uo', T1234),
  syllable('guai', 'g', 'uai', T1234),
  syllable('gui', 'g', 'ui', T1234),
  syllable('guan', 'g', 'uan', T1234),
  syllable('gun', 'g', 'un', T1234),
  syllable('guang', 'g', 'uang', T1234),
  syllable('gong', 'g', 'ong', T1234),

  syllable('ka', 'k', 'a', T1234),
  syllable('ke', 'k', 'e', T1234),
  syllable('kai', 'k', 'ai', T1234),
  syllable('kao', 'k', 'ao', T1234),
  syllable('kou', 'k', 'ou', T1234),
  syllable('kan', 'k', 'an', T1234),
  syllable('ken', 'k', 'en', T1234),
  syllable('kang', 'k', 'ang', [1, 2, 4]),
  syllable('keng', 'k', 'eng', T1234),
  syllable('ku', 'k', 'u', T1234),
  syllable('kua', 'k', 'ua', T1234),
  syllable('kuo', 'k', 'uo', T1234),
  syllable('kuai', 'k', 'uai', T1234),
  syllable('kui', 'k', 'ui', T1234),
  syllable('kuan', 'k', 'uan', T1234),
  syllable('kun', 'k', 'un', T1234),
  syllable('kuang', 'k', 'uang', T1234),
  syllable('kong', 'k', 'ong', T1234),

  syllable('ha', 'h', 'a', T1234),
  syllable('he', 'h', 'e', T1234),
  syllable('hai', 'h', 'ai', T1234),
  syllable('hei', 'h', 'ei', T1234),
  syllable('hao', 'h', 'ao', T1234),
  syllable('hou', 'h', 'ou', T1234),
  syllable('han', 'h', 'an', T1234),
  syllable('hen', 'h', 'en', T1234),
  syllable('hang', 'h', 'ang', T1234),
  syllable('heng', 'h', 'eng', T1234),
  syllable('hu', 'h', 'u', T1234),
  syllable('hua', 'h', 'ua', T1234),
  syllable('huo', 'h', 'uo', T1234),
  syllable('huai', 'h', 'uai', T1234),
  syllable('hui', 'h', 'ui', T1234),
  syllable('huan', 'h', 'uan', T1234),
  syllable('hun', 'h', 'un', T1234),
  syllable('huang', 'h', 'uang', T1234),
  syllable('hong', 'h', 'ong', T1234),

  // Palatals: j, q, x (combine with i, ü finals)
  syllable('ji', 'j', 'i', T1234),
  syllable('jia', 'j', 'ia', T1234),
  syllable('jie', 'j', 'ie', T1234),
  syllable('jiao', 'j', 'iao', T1234),
  syllable('jiu', 'j', 'iu', T1234),
  syllable('jian', 'j', 'ian', T1234),
  syllable('jin', 'j', 'in', T1234),
  syllable('jiang', 'j', 'iang', T1234),
  syllable('jing', 'j', 'ing', [1, 3, 4]),
  syllable('jiong', 'j', 'iong', T1234),
  syllable('ju', 'j', 'ü', T1234),
  syllable('jue', 'j', 'üe', T1234),
  syllable('juan', 'j', 'üan', T1234),
  syllable('jun', 'j', 'ün', T1234),

  syllable('qi', 'q', 'i', T1234),
  syllable('qia', 'q', 'ia', T1234),
  syllable('qie', 'q', 'ie', T1234),
  syllable('qiao', 'q', 'iao', T1234),
  syllable('qiu', 'q', 'iu', T1234),
  syllable('qian', 'q', 'ian', T1234),
  syllable('qin', 'q', 'in', T1234),
  syllable('qiang', 'q', 'iang', T1234),
  syllable('qing', 'q', 'ing', T1234),
  syllable('qiong', 'q', 'iong', T1234),
  syllable('qu', 'q', 'ü', T1234),
  syllable('que', 'q', 'üe', T1234),
  syllable('quan', 'q', 'üan', T1234),
  syllable('qun', 'q', 'ün', T1234),

  syllable('xi', 'x', 'i', T1234),
  syllable('xia', 'x', 'ia', T1234),
  syllable('xie', 'x', 'ie', T1234),
  syllable('xiao', 'x', 'iao', T1234),
  syllable('xiu', 'x', 'iu', T234),
  syllable('xian', 'x', 'ian', T1234),
  syllable('xin', 'x', 'in', [1, 2, 4]),
  syllable('xiang', 'x', 'iang', [1, 3, 4]),
  syllable('xing', 'x', 'ing', T1234),
  syllable('xiong', 'x', 'iong', T1234),
  syllable('xu', 'x', 'ü', T1234),
  syllable('xue', 'x', 'üe', T1234),
  syllable('xuan', 'x', 'üan', T1234),
  syllable('xun', 'x', 'ün', T1234),

  // Retroflexes: zh, ch, sh, r
  syllable('zha', 'zh', 'a', T1234),
  syllable('zhe', 'zh', 'e', T1234),
  syllable('zhai', 'zh', 'ai', T123),
  syllable('zhei', 'zh', 'ei', T1234),
  syllable('zhao', 'zh', 'ao', T1234),
  syllable('zhou', 'zh', 'ou', T1234),
  syllable('zhan', 'zh', 'an', T234),
  syllable('zhen', 'zh', 'en', T1234),
  syllable('zhang', 'zh', 'ang', T1234),
  syllable('zheng', 'zh', 'eng', T1234),
  syllable('zhi', 'zh', 'i', T1234),
  syllable('zhu', 'zh', 'u', T1234),
  syllable('zhua', 'zh', 'ua', T1234),
  syllable('zhuo', 'zh', 'uo', T1234),
  syllable('zhuai', 'zh', 'uai', T1234),
  syllable('zhui', 'zh', 'ui', T1234),
  syllable('zhuan', 'zh', 'uan', T1234),
  syllable('zhun', 'zh', 'un', T1234),
  syllable('zhuang', 'zh', 'uang', T1234),
  syllable('zhong', 'zh', 'ong', T1234),

  syllable('cha', 'ch', 'a', T1234),
  syllable('che', 'ch', 'e', T1234),
  syllable('chai', 'ch', 'ai', T1234),
  syllable('chao', 'ch', 'ao', T1234),
  syllable('chou', 'ch', 'ou', T1234),
  syllable('chan', 'ch', 'an', T1234),
  syllable('chen', 'ch', 'en', T1234),
  syllable('chang', 'ch', 'ang', T1234),
  syllable('cheng', 'ch', 'eng', T1234),
  syllable('chi', 'ch', 'i', T1234),
  syllable('chu', 'ch', 'u', T1234),
  syllable('chua', 'ch', 'ua', T1234),
  syllable('chuo', 'ch', 'uo', T1234),
  syllable('chuai', 'ch', 'uai', T1234),
  syllable('chui', 'ch', 'ui', T1234),
  syllable('chuan', 'ch', 'uan', T1234),
  syllable('chun', 'ch', 'un', T1234),
  syllable('chuang', 'ch', 'uang', T1234),
  syllable('chong', 'ch', 'ong', T1234),

  syllable('sha', 'sh', 'a', T1234),
  syllable('she', 'sh', 'e', T1234),
  syllable('shai', 'sh', 'ai', T1234),
  syllable('shei', 'sh', 'ei', T1234),
  syllable('shao', 'sh', 'ao', T1234),
  syllable('shou', 'sh', 'ou', T1234),
  syllable('shan', 'sh', 'an', T1234),
  syllable('shen', 'sh', 'en', T1234),
  syllable('shang', 'sh', 'ang', T1234),
  syllable('sheng', 'sh', 'eng', T1234),
  syllable('shi', 'sh', 'i', T1234),
  syllable('shu', 'sh', 'u', T1234),
  syllable('shua', 'sh', 'ua', T1234),
  syllable('shuo', 'sh', 'uo', T1234),
  syllable('shuai', 'sh', 'uai', T1234),
  syllable('shui', 'sh', 'ui', T1234),
  syllable('shuan', 'sh', 'uan', T1234),
  syllable('shun', 'sh', 'un', T1234),
  syllable('shuang', 'sh', 'uang', T1234),

  syllable('re', 'r', 'e', T1234),
  syllable('rao', 'r', 'ao', T1234),
  syllable('rou', 'r', 'ou', T1234),
  syllable('ran', 'r', 'an', T1234),
  syllable('ren', 'r', 'en', T1234),
  syllable('rang', 'r', 'ang', T1234),
  syllable('reng', 'r', 'eng', T1234),
  syllable('ri', 'r', 'i', T1234),
  syllable('ru', 'r', 'u', T1234),
  syllable('ruo', 'r', 'uo', T1234),
  syllable('rui', 'r', 'ui', T234),
  syllable('ruan', 'r', 'uan', T1234),
  syllable('run', 'r', 'un', T1234),
  syllable('rong', 'r', 'ong', T1234),

  // Sibilants: z, c, s
  syllable('za', 'z', 'a', T1234),
  syllable('ze', 'z', 'e', T1234),
  syllable('zai', 'z', 'ai', [1, 3, 4]),
  syllable('zei', 'z', 'ei', T1234),
  syllable('zao', 'z', 'ao', T1234),
  syllable('zou', 'z', 'ou', T1234),
  syllable('zan', 'z', 'an', T1234),
  syllable('zen', 'z', 'en', T1234),
  syllable('zang', 'z', 'ang', T1234),
  syllable('zeng', 'z', 'eng', T1234),
  syllable('zi', 'z', 'i', T1234),
  syllable('zu', 'z', 'u', T1234),
  syllable('zuo', 'z', 'uo', T1234),
  syllable('zui', 'z', 'ui', T1234),
  syllable('zuan', 'z', 'uan', T1234),
  syllable('zun', 'z', 'un', T1234),
  syllable('zong', 'z', 'ong', T1234),

  syllable('ca', 'c', 'a', T1234),
  syllable('ce', 'c', 'e', T1234),
  syllable('cai', 'c', 'ai', T1234),
  syllable('cao', 'c', 'ao', T1234),
  syllable('cou', 'c', 'ou', T1234),
  syllable('can', 'c', 'an', T1234),
  syllable('cen', 'c', 'en', T1234),
  syllable('cang', 'c', 'ang', T1234),
  syllable('ceng', 'c', 'eng', T1234),
  syllable('ci', 'c', 'i', T1234),
  syllable('cu', 'c', 'u', T1234),
  syllable('cuo', 'c', 'uo', [1, 3, 4]),
  syllable('cui', 'c', 'ui', T1234),
  syllable('cuan', 'c', 'uan', T1234),
  syllable('cun', 'c', 'un', T1234),
  syllable('cong', 'c', 'ong', T1234),

  syllable('sa', 's', 'a', T1234),
  syllable('se', 's', 'e', T1234),
  syllable('sai', 's', 'ai', T1234),
  syllable('sao', 's', 'ao', T1234),
  syllable('sou', 's', 'ou', T1234),
  syllable('san', 's', 'an', T1234),
  syllable('sen', 's', 'en', T1234),
  syllable('sang', 's', 'ang', [1, 2, 4]),
  syllable('seng', 's', 'eng', T1234),
  syllable('si', 's', 'i', T1234),
  syllable('su', 's', 'u', T1234),
  syllable('suo', 's', 'uo', T1234),
  syllable('sui', 's', 'ui', T1234),
  syllable('suan', 's', 'uan', T1234),
  syllable('sun', 's', 'un', T1234),
  syllable('song', 's', 'ong', T1234),

  // Special syllables that don't follow standard patterns
  syllable('yi', '', 'i', T1234),
  syllable('ya', '', 'ia', T1234),
  syllable('ye', '', 'ie', T1234),
  syllable('yao', '', 'iao', T1234),
  syllable('you', '', 'iu', T1234),
  syllable('yan', '', 'ian', T1234),
  syllable('yin', '', 'in', T1234),
  syllable('yang', '', 'iang', T1234),
  syllable('ying', '', 'ing', T1234),
  syllable('yong', '', 'iong', T1234),

  syllable('wu', '', 'u', T1234),
  syllable('wa', '', 'ua', T1234),
  syllable('wo', '', 'uo', T1234),
  syllable('wai', '', 'uai', T1234),
  syllable('wei', '', 'ui', T1234),
  syllable('wan', '', 'uan', T1234),
  syllable('wen', '', 'un', T1234),
  syllable('wang', '', 'uang', T1234),
  syllable('weng', '', 'ueng', T1234),

  syllable('yu', '', 'ü', T1234),
  syllable('yue', '', 'üe', T1234),
  syllable('yuan', '', 'üan', T1234),
  syllable('yun', '', 'ün', T1234),
];

/**
 * Helper functions
 */

// Get syllable by pinyin (without tone)
export function getSyllable(pinyin: string): PinyinSyllable | undefined {
  return PINYIN_SYLLABLES.find(s => s.pinyin === pinyin);
}

// Get all syllables for a tone
export function getSyllablesForTone(tone: number): PinyinSyllable[] {
  return PINYIN_SYLLABLES.filter(s => s.tones.includes(tone));
}

// Get all syllables with a specific initial
export function getSyllablesByInitial(initial: string): PinyinSyllable[] {
  return PINYIN_SYLLABLES.filter(s => s.initial === initial);
}

// Get all syllables with a specific final
export function getSyllablesByFinal(final: string): PinyinSyllable[] {
  return PINYIN_SYLLABLES.filter(s => s.final === final);
}

// Check if a syllable-tone combination is valid
export function isValidPinyin(pinyin: string, tone: number): boolean {
  const syllable = getSyllable(pinyin);
  return syllable ? syllable.tones.includes(tone) : false;
}

// Total count
export const SYLLABLE_COUNT = PINYIN_SYLLABLES.length;

// Total syllable-tone combinations
export const TOTAL_COMBINATIONS = PINYIN_SYLLABLES.reduce(
  (sum, s) => sum + s.tones.length,
  0
);
