import {DynamR} from '../src';
import {DynamROptions} from '../src';
import axios from 'axios';

jest.mock('axios');
(axios as unknown as jest.Mock).mockResolvedValue({data: '{"a":1}'});

it('should set default properties', () => {
  const d = new DynamR();

  expect(['http', 'https']).toContain(d.protocol);
  expect(typeof d.hostname).toBe('string');
  expect(typeof d.port).toBe('string');
});

it('should set configured properties', () => {
  const opts: DynamROptions = {
    protocol: 'https',
    hostname: 'abc',
    port: 'def',
  };
  const d = new DynamR(opts);

  expect(d.protocol).toBe(opts.protocol);
  expect(d.hostname).toBe(opts.hostname);
  expect(d.port).toBe(opts.port);
});

describe('methods', () => {
  const d = new DynamR();

  beforeEach(() => jest.clearAllMocks());

  test('getPresets', async () => {
    await d.getPresets();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('getLightStatus', async () => {
    await d.getLightStatus();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('setLightPreset', async () => {
    await d.setLightPreset('abc');
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('setLightColor', async () => {
    await d.setLightColor('abc');
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('beginSession', async () => {
    await d.beginSession('abc');
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('exitSession', async () => {
    await d.exitSession();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('endSession', async () => {
    await d.endSession();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('getSessionStatus', async () => {
    await d.getSessionStatus();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('reloadSpeedRound', async () => {
    await d.reloadSpeedRound();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('bustEnter', async () => {
    await d.bustEnter();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('bustLeave', async () => {
    await d.bustLeave();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('stopSpeedRound', async () => {
    await d.stopSpeedRound();
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('setODE', async () => {
    await d.setODE('abc');
    expect(axios).toHaveBeenCalledTimes(1);
  });
  test('setETH0', async () => {
    await d.setETH0(true);
    await d.setETH0(false, 'abc', 'abc');
    expect(axios).toHaveBeenCalledTimes(2);
  });
});
