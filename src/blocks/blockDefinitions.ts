/* =========================================================================
   Block Definitions for CodexaBlock
   Closely mirrors the Scratch 3 block specification.
   ========================================================================= */

export type BlockShape = 'hat' | 'stack' | 'reporter' | 'boolean' | 'cap' | 'c-block';

export interface InputSlot {
  type: 'number' | 'string' | 'dropdown' | 'block';
  default?: string | number;
  options?: string[]; // for dropdown
  label?: string;
}

export interface BlockDef {
  opcode: string;
  label: string;
  shape: BlockShape;
  inputs?: Record<string, InputSlot>;
  /** If true, this block wraps inner blocks (like repeat, forever, if) */
  hasMouth?: boolean;
  /** For if/else, second mouth */
  hasElseMouth?: boolean;
}

export interface BlockCategory {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  blocks: BlockDef[];
}

// ─── MOTION ─────────────────────────────────────────────────────────────────

const motionBlocks: BlockDef[] = [
  { opcode: 'motion_movesteps', label: 'move %NUM steps', shape: 'stack', inputs: { NUM: { type: 'number', default: 10 } } },
  { opcode: 'motion_turnright', label: 'turn ↻ %NUM degrees', shape: 'stack', inputs: { NUM: { type: 'number', default: 15 } } },
  { opcode: 'motion_turnleft', label: 'turn ↺ %NUM degrees', shape: 'stack', inputs: { NUM: { type: 'number', default: 15 } } },
  { opcode: 'motion_goto', label: 'go to %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['random position', 'mouse-pointer'], default: 'random position' } } },
  { opcode: 'motion_gotoxy', label: 'go to x: %X y: %Y', shape: 'stack', inputs: { X: { type: 'number', default: 0 }, Y: { type: 'number', default: 0 } } },
  { opcode: 'motion_glideto', label: 'glide %SECS secs to %DROPDOWN', shape: 'stack', inputs: { SECS: { type: 'number', default: 1 }, DROPDOWN: { type: 'dropdown', options: ['random position', 'mouse-pointer'], default: 'random position' } } },
  { opcode: 'motion_glidetoxy', label: 'glide %SECS secs to x: %X y: %Y', shape: 'stack', inputs: { SECS: { type: 'number', default: 1 }, X: { type: 'number', default: 0 }, Y: { type: 'number', default: 0 } } },
  { opcode: 'motion_pointindirection', label: 'point in direction %DIR', shape: 'stack', inputs: { DIR: { type: 'number', default: 90 } } },
  { opcode: 'motion_pointtowards', label: 'point towards %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['mouse-pointer'], default: 'mouse-pointer' } } },
  { opcode: 'motion_changexby', label: 'change x by %NUM', shape: 'stack', inputs: { NUM: { type: 'number', default: 10 } } },
  { opcode: 'motion_setx', label: 'set x to %NUM', shape: 'stack', inputs: { NUM: { type: 'number', default: 0 } } },
  { opcode: 'motion_changeyby', label: 'change y by %NUM', shape: 'stack', inputs: { NUM: { type: 'number', default: 10 } } },
  { opcode: 'motion_sety', label: 'set y to %NUM', shape: 'stack', inputs: { NUM: { type: 'number', default: 0 } } },
  { opcode: 'motion_ifonedgebounce', label: 'if on edge, bounce', shape: 'stack' },
  { opcode: 'motion_setrotationstyle', label: 'set rotation style %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['left-right', "don't rotate", 'all around'], default: 'left-right' } } },
  { opcode: 'motion_xposition', label: 'x position', shape: 'reporter' },
  { opcode: 'motion_yposition', label: 'y position', shape: 'reporter' },
  { opcode: 'motion_direction', label: 'direction', shape: 'reporter' },
];

// ─── LOOKS ──────────────────────────────────────────────────────────────────

const looksBlocks: BlockDef[] = [
  { opcode: 'looks_sayforsecs', label: 'say %TEXT for %SECS seconds', shape: 'stack', inputs: { TEXT: { type: 'string', default: 'Hello!' }, SECS: { type: 'number', default: 2 } } },
  { opcode: 'looks_say', label: 'say %TEXT', shape: 'stack', inputs: { TEXT: { type: 'string', default: 'Hello!' } } },
  { opcode: 'looks_thinkforsecs', label: 'think %TEXT for %SECS seconds', shape: 'stack', inputs: { TEXT: { type: 'string', default: 'Hmm...' }, SECS: { type: 'number', default: 2 } } },
  { opcode: 'looks_think', label: 'think %TEXT', shape: 'stack', inputs: { TEXT: { type: 'string', default: 'Hmm...' } } },
  { opcode: 'looks_switchcostumeto', label: 'switch costume to %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['costume1'], default: 'costume1' } } },
  { opcode: 'looks_nextcostume', label: 'next costume', shape: 'stack' },
  { opcode: 'looks_switchbackdropto', label: 'switch backdrop to %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['backdrop1'], default: 'backdrop1' } } },
  { opcode: 'looks_nextbackdrop', label: 'next backdrop', shape: 'stack' },
  { opcode: 'looks_changesizeby', label: 'change size by %NUM', shape: 'stack', inputs: { NUM: { type: 'number', default: 10 } } },
  { opcode: 'looks_setsizeto', label: 'set size to %NUM %', shape: 'stack', inputs: { NUM: { type: 'number', default: 100 } } },
  { opcode: 'looks_changeeffectby', label: 'change %DROPDOWN effect by %NUM', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['color', 'fisheye', 'whirl', 'pixelate', 'mosaic', 'brightness', 'ghost'], default: 'color' }, NUM: { type: 'number', default: 25 } } },
  { opcode: 'looks_seteffectto', label: 'set %DROPDOWN effect to %NUM', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['color', 'fisheye', 'whirl', 'pixelate', 'mosaic', 'brightness', 'ghost'], default: 'color' }, NUM: { type: 'number', default: 0 } } },
  { opcode: 'looks_cleargraphiceffects', label: 'clear graphic effects', shape: 'stack' },
  { opcode: 'looks_show', label: 'show', shape: 'stack' },
  { opcode: 'looks_hide', label: 'hide', shape: 'stack' },
  { opcode: 'looks_gotofrontback', label: 'go to %DROPDOWN layer', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['front', 'back'], default: 'front' } } },
  { opcode: 'looks_goforwardbackwardlayers', label: 'go %DROPDOWN %NUM layers', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['forward', 'backward'], default: 'forward' }, NUM: { type: 'number', default: 1 } } },
  { opcode: 'looks_costumenumbername', label: 'costume %DROPDOWN', shape: 'reporter', inputs: { DROPDOWN: { type: 'dropdown', options: ['number', 'name'], default: 'number' } } },
  { opcode: 'looks_backdropnumbername', label: 'backdrop %DROPDOWN', shape: 'reporter', inputs: { DROPDOWN: { type: 'dropdown', options: ['number', 'name'], default: 'number' } } },
  { opcode: 'looks_size', label: 'size', shape: 'reporter' },
];

// ─── SOUND ──────────────────────────────────────────────────────────────────

const soundBlocks: BlockDef[] = [
  { opcode: 'sound_playuntildone', label: 'play sound %DROPDOWN until done', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['Meow'], default: 'Meow' } } },
  { opcode: 'sound_play', label: 'start sound %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['Meow'], default: 'Meow' } } },
  { opcode: 'sound_stopallsounds', label: 'stop all sounds', shape: 'stack' },
  { opcode: 'sound_changeeffectby', label: 'change %DROPDOWN effect by %NUM', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['pitch', 'pan left/right'], default: 'pitch' }, NUM: { type: 'number', default: 10 } } },
  { opcode: 'sound_seteffectto', label: 'set %DROPDOWN effect to %NUM', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['pitch', 'pan left/right'], default: 'pitch' }, NUM: { type: 'number', default: 100 } } },
  { opcode: 'sound_cleareffects', label: 'clear sound effects', shape: 'stack' },
  { opcode: 'sound_changevolumeby', label: 'change volume by %NUM', shape: 'stack', inputs: { NUM: { type: 'number', default: -10 } } },
  { opcode: 'sound_setvolumeto', label: 'set volume to %NUM %', shape: 'stack', inputs: { NUM: { type: 'number', default: 100 } } },
  { opcode: 'sound_volume', label: 'volume', shape: 'reporter' },
];

// ─── EVENTS ─────────────────────────────────────────────────────────────────

const eventBlocks: BlockDef[] = [
  { opcode: 'event_whenflagclicked', label: '⚑ when green flag clicked', shape: 'hat' },
  { opcode: 'event_whenkeypressed', label: 'when %DROPDOWN key pressed', shape: 'hat', inputs: { DROPDOWN: { type: 'dropdown', options: ['space', 'up arrow', 'down arrow', 'left arrow', 'right arrow', 'any', 'a', 'b', 'c'], default: 'space' } } },
  { opcode: 'event_whenthisspriteclicked', label: 'when this sprite clicked', shape: 'hat' },
  { opcode: 'event_whenbackdropswitchesto', label: 'when backdrop switches to %DROPDOWN', shape: 'hat', inputs: { DROPDOWN: { type: 'dropdown', options: ['backdrop1'], default: 'backdrop1' } } },
  { opcode: 'event_whengreaterthan', label: 'when %DROPDOWN > %NUM', shape: 'hat', inputs: { DROPDOWN: { type: 'dropdown', options: ['loudness', 'timer'], default: 'loudness' }, NUM: { type: 'number', default: 10 } } },
  { opcode: 'event_whenbroadcastreceived', label: 'when I receive %DROPDOWN', shape: 'hat', inputs: { DROPDOWN: { type: 'dropdown', options: ['message1'], default: 'message1' } } },
  { opcode: 'event_broadcast', label: 'broadcast %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['message1'], default: 'message1' } } },
  { opcode: 'event_broadcastandwait', label: 'broadcast %DROPDOWN and wait', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['message1'], default: 'message1' } } },
];

// ─── CONTROL ────────────────────────────────────────────────────────────────

const controlBlocks: BlockDef[] = [
  { opcode: 'control_wait', label: 'wait %SECS seconds', shape: 'stack', inputs: { SECS: { type: 'number', default: 1 } } },
  { opcode: 'control_repeat', label: 'repeat %TIMES', shape: 'c-block', hasMouth: true, inputs: { TIMES: { type: 'number', default: 10 } } },
  { opcode: 'control_forever', label: 'forever', shape: 'c-block', hasMouth: true },
  { opcode: 'control_if', label: 'if %CONDITION then', shape: 'c-block', hasMouth: true },
  { opcode: 'control_if_else', label: 'if %CONDITION then', shape: 'c-block', hasMouth: true, hasElseMouth: true },
  { opcode: 'control_wait_until', label: 'wait until %CONDITION', shape: 'stack' },
  { opcode: 'control_repeat_until', label: 'repeat until %CONDITION', shape: 'c-block', hasMouth: true },
  { opcode: 'control_stop', label: 'stop %DROPDOWN', shape: 'cap', inputs: { DROPDOWN: { type: 'dropdown', options: ['all', 'this script', 'other scripts in sprite'], default: 'all' } } },
  { opcode: 'control_start_as_clone', label: 'when I start as a clone', shape: 'hat' },
  { opcode: 'control_create_clone_of', label: 'create clone of %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['myself'], default: 'myself' } } },
  { opcode: 'control_delete_this_clone', label: 'delete this clone', shape: 'cap' },
];

// ─── SENSING ────────────────────────────────────────────────────────────────

const sensingBlocks: BlockDef[] = [
  { opcode: 'sensing_touchingobject', label: 'touching %DROPDOWN ?', shape: 'boolean', inputs: { DROPDOWN: { type: 'dropdown', options: ['mouse-pointer', 'edge'], default: 'mouse-pointer' } } },
  { opcode: 'sensing_touchingcolor', label: 'touching color %COLOR ?', shape: 'boolean', inputs: { COLOR: { type: 'string', default: '#ff0000' } } },
  { opcode: 'sensing_coloristouchingcolor', label: 'color %COLOR1 is touching %COLOR2 ?', shape: 'boolean', inputs: { COLOR1: { type: 'string', default: '#ff0000' }, COLOR2: { type: 'string', default: '#0000ff' } } },
  { opcode: 'sensing_distanceto', label: 'distance to %DROPDOWN', shape: 'reporter', inputs: { DROPDOWN: { type: 'dropdown', options: ['mouse-pointer'], default: 'mouse-pointer' } } },
  { opcode: 'sensing_askandwait', label: 'ask %TEXT and wait', shape: 'stack', inputs: { TEXT: { type: 'string', default: "What's your name?" } } },
  { opcode: 'sensing_answer', label: 'answer', shape: 'reporter' },
  { opcode: 'sensing_keypressed', label: 'key %DROPDOWN pressed?', shape: 'boolean', inputs: { DROPDOWN: { type: 'dropdown', options: ['space', 'up arrow', 'down arrow', 'left arrow', 'right arrow'], default: 'space' } } },
  { opcode: 'sensing_mousedown', label: 'mouse down?', shape: 'boolean' },
  { opcode: 'sensing_mousex', label: 'mouse x', shape: 'reporter' },
  { opcode: 'sensing_mousey', label: 'mouse y', shape: 'reporter' },
  { opcode: 'sensing_setdragmode', label: 'set drag mode %DROPDOWN', shape: 'stack', inputs: { DROPDOWN: { type: 'dropdown', options: ['draggable', 'not draggable'], default: 'draggable' } } },
  { opcode: 'sensing_loudness', label: 'loudness', shape: 'reporter' },
  { opcode: 'sensing_timer', label: 'timer', shape: 'reporter' },
  { opcode: 'sensing_resettimer', label: 'reset timer', shape: 'stack' },
  { opcode: 'sensing_of', label: '%DROPDOWN of %SPRITE', shape: 'reporter', inputs: { DROPDOWN: { type: 'dropdown', options: ['x position', 'y position', 'direction', 'costume #', 'costume name', 'size', 'volume'], default: 'x position' }, SPRITE: { type: 'dropdown', options: ['Sprite1'], default: 'Sprite1' } } },
  { opcode: 'sensing_current', label: 'current %DROPDOWN', shape: 'reporter', inputs: { DROPDOWN: { type: 'dropdown', options: ['year', 'month', 'date', 'day of week', 'hour', 'minute', 'second'], default: 'year' } } },
  { opcode: 'sensing_dayssince2000', label: 'days since 2000', shape: 'reporter' },
  { opcode: 'sensing_username', label: 'username', shape: 'reporter' },
];

// ─── OPERATORS ──────────────────────────────────────────────────────────────

const operatorBlocks: BlockDef[] = [
  { opcode: 'operator_add', label: '%NUM1 + %NUM2', shape: 'reporter', inputs: { NUM1: { type: 'number', default: '' as unknown as number }, NUM2: { type: 'number', default: '' as unknown as number } } },
  { opcode: 'operator_subtract', label: '%NUM1 - %NUM2', shape: 'reporter', inputs: { NUM1: { type: 'number', default: '' as unknown as number }, NUM2: { type: 'number', default: '' as unknown as number } } },
  { opcode: 'operator_multiply', label: '%NUM1 * %NUM2', shape: 'reporter', inputs: { NUM1: { type: 'number', default: '' as unknown as number }, NUM2: { type: 'number', default: '' as unknown as number } } },
  { opcode: 'operator_divide', label: '%NUM1 / %NUM2', shape: 'reporter', inputs: { NUM1: { type: 'number', default: '' as unknown as number }, NUM2: { type: 'number', default: '' as unknown as number } } },
  { opcode: 'operator_random', label: 'pick random %FROM to %TO', shape: 'reporter', inputs: { FROM: { type: 'number', default: 1 }, TO: { type: 'number', default: 10 } } },
  { opcode: 'operator_gt', label: '%OP1 > %OP2', shape: 'boolean', inputs: { OP1: { type: 'number', default: '' as unknown as number }, OP2: { type: 'number', default: 50 } } },
  { opcode: 'operator_lt', label: '%OP1 < %OP2', shape: 'boolean', inputs: { OP1: { type: 'number', default: '' as unknown as number }, OP2: { type: 'number', default: 50 } } },
  { opcode: 'operator_equals', label: '%OP1 = %OP2', shape: 'boolean', inputs: { OP1: { type: 'number', default: '' as unknown as number }, OP2: { type: 'number', default: 50 } } },
  { opcode: 'operator_and', label: '%OP1 and %OP2', shape: 'boolean' },
  { opcode: 'operator_or', label: '%OP1 or %OP2', shape: 'boolean' },
  { opcode: 'operator_not', label: 'not %OP', shape: 'boolean' },
  { opcode: 'operator_join', label: 'join %STR1 %STR2', shape: 'reporter', inputs: { STR1: { type: 'string', default: 'apple' }, STR2: { type: 'string', default: 'banana' } } },
  { opcode: 'operator_letter_of', label: 'letter %NUM of %STR', shape: 'reporter', inputs: { NUM: { type: 'number', default: 1 }, STR: { type: 'string', default: 'apple' } } },
  { opcode: 'operator_length', label: 'length of %STR', shape: 'reporter', inputs: { STR: { type: 'string', default: 'apple' } } },
  { opcode: 'operator_contains', label: '%STR1 contains %STR2 ?', shape: 'boolean', inputs: { STR1: { type: 'string', default: 'apple' }, STR2: { type: 'string', default: 'a' } } },
  { opcode: 'operator_mod', label: '%NUM1 mod %NUM2', shape: 'reporter', inputs: { NUM1: { type: 'number', default: '' as unknown as number }, NUM2: { type: 'number', default: '' as unknown as number } } },
  { opcode: 'operator_round', label: 'round %NUM', shape: 'reporter', inputs: { NUM: { type: 'number', default: '' as unknown as number } } },
  { opcode: 'operator_mathop', label: '%DROPDOWN of %NUM', shape: 'reporter', inputs: { DROPDOWN: { type: 'dropdown', options: ['abs', 'floor', 'ceiling', 'sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', 'e ^', '10 ^'], default: 'abs' }, NUM: { type: 'number', default: '' as unknown as number } } },
];

// ─── VARIABLES ──────────────────────────────────────────────────────────────

const variableBlocks: BlockDef[] = [
  { opcode: 'data_setvariableto', label: 'set %VAR to %VALUE', shape: 'stack', inputs: { VAR: { type: 'dropdown', options: ['my variable'], default: 'my variable' }, VALUE: { type: 'string', default: '0' } } },
  { opcode: 'data_changevariableby', label: 'change %VAR by %NUM', shape: 'stack', inputs: { VAR: { type: 'dropdown', options: ['my variable'], default: 'my variable' }, NUM: { type: 'number', default: 1 } } },
  { opcode: 'data_showvariable', label: 'show variable %VAR', shape: 'stack', inputs: { VAR: { type: 'dropdown', options: ['my variable'], default: 'my variable' } } },
  { opcode: 'data_hidevariable', label: 'hide variable %VAR', shape: 'stack', inputs: { VAR: { type: 'dropdown', options: ['my variable'], default: 'my variable' } } },
  { opcode: 'data_addtolist', label: 'add %ITEM to %LIST', shape: 'stack', inputs: { ITEM: { type: 'string', default: 'thing' }, LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
  { opcode: 'data_deleteoflist', label: 'delete %INDEX of %LIST', shape: 'stack', inputs: { INDEX: { type: 'number', default: 1 }, LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
  { opcode: 'data_deletealloflist', label: 'delete all of %LIST', shape: 'stack', inputs: { LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
  { opcode: 'data_insertatlist', label: 'insert %ITEM at %INDEX of %LIST', shape: 'stack', inputs: { ITEM: { type: 'string', default: 'thing' }, INDEX: { type: 'number', default: 1 }, LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
  { opcode: 'data_replaceitemoflist', label: 'replace item %INDEX of %LIST with %ITEM', shape: 'stack', inputs: { INDEX: { type: 'number', default: 1 }, LIST: { type: 'dropdown', options: ['my list'], default: 'my list' }, ITEM: { type: 'string', default: 'thing' } } },
  { opcode: 'data_itemoflist', label: 'item %INDEX of %LIST', shape: 'reporter', inputs: { INDEX: { type: 'number', default: 1 }, LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
  { opcode: 'data_itemnumoflist', label: 'item # of %ITEM in %LIST', shape: 'reporter', inputs: { ITEM: { type: 'string', default: 'thing' }, LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
  { opcode: 'data_lengthoflist', label: 'length of %LIST', shape: 'reporter', inputs: { LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
  { opcode: 'data_listcontainsitem', label: '%LIST contains %ITEM ?', shape: 'boolean', inputs: { LIST: { type: 'dropdown', options: ['my list'], default: 'my list' }, ITEM: { type: 'string', default: 'thing' } } },
  { opcode: 'data_showlist', label: 'show list %LIST', shape: 'stack', inputs: { LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
  { opcode: 'data_hidelist', label: 'hide list %LIST', shape: 'stack', inputs: { LIST: { type: 'dropdown', options: ['my list'], default: 'my list' } } },
];

// ─── MY BLOCKS ──────────────────────────────────────────────────────────────

const myBlocks: BlockDef[] = [
  { opcode: 'procedures_definition', label: 'define %NAME', shape: 'hat', inputs: { NAME: { type: 'string', default: 'my block' } } },
  { opcode: 'procedures_call', label: '%NAME', shape: 'stack', inputs: { NAME: { type: 'string', default: 'my block' } } },
];

// ─── ALL CATEGORIES ─────────────────────────────────────────────────────────

export const blockCategories: BlockCategory[] = [
  { id: 'motion', name: 'Motion', color: '#4C97FF', secondaryColor: '#4280D7', blocks: motionBlocks },
  { id: 'looks', name: 'Looks', color: '#9966FF', secondaryColor: '#855CD6', blocks: looksBlocks },
  { id: 'sound', name: 'Sound', color: '#CF63CF', secondaryColor: '#BD42BD', blocks: soundBlocks },
  { id: 'events', name: 'Events', color: '#FFBF00', secondaryColor: '#E6AC00', blocks: eventBlocks },
  { id: 'control', name: 'Control', color: '#FFAB19', secondaryColor: '#EC9C13', blocks: controlBlocks },
  { id: 'sensing', name: 'Sensing', color: '#5CB1D6', secondaryColor: '#47A8D1', blocks: sensingBlocks },
  { id: 'operators', name: 'Operators', color: '#59C059', secondaryColor: '#46B946', blocks: operatorBlocks },
  { id: 'variables', name: 'Variables', color: '#FF8C1A', secondaryColor: '#E57A00', blocks: variableBlocks },
  { id: 'myblocks', name: 'My Blocks', color: '#FF6680', secondaryColor: '#FF3355', blocks: myBlocks },
];

export function getCategoryById(id: string): BlockCategory | undefined {
  return blockCategories.find((c) => c.id === id);
}

export function getBlockDef(opcode: string): BlockDef | undefined {
  for (const cat of blockCategories) {
    const found = cat.blocks.find((b) => b.opcode === opcode);
    if (found) return found;
  }
  return undefined;
}

export function getCategoryForBlock(opcode: string): BlockCategory | undefined {
  return blockCategories.find((cat) => cat.blocks.some((b) => b.opcode === opcode));
}
