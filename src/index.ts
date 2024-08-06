import axios, {AxiosResponse} from 'axios';

export interface DynamROptions {
  /** The protocol to use */
  protocol?: 'http' | 'https';
  /** The DynamR server's address */
  hostname?: string;
  /** The DynamR server's port */
  port?: string;
}

export interface Payload {
  procedure: string;
  args?: any[];
  kwargs?: Record<string, any>;
}

export interface SuccessResponse {
  args: any[];
}

export interface FailureResponse {
  error: string;
  args: any[];
  kwargs?: Record<string, any>;
}

export interface GetPresetsResponse extends SuccessResponse {
  args: [
    {
      /** Preset name */
      name: string;
      /** An object with DMX channel IDs as keys and #hex colors as values  */
      colors: Record<string, string>;
      /** Whether the preset is editable by the user */
      locked: boolean;
      /** Preset ID */
      id: number;
    }[]
  ];
}

export interface GetLightStatusResponse extends SuccessResponse {
  args: [
    | {
        type: 'preset';
        /** Preset name */
        value: string;
      }
    | {
        type: 'color';
        /** RGB decimal value */
        value: [number, number, number];
      }
  ];
}

export interface SetLightPresetResponse extends SuccessResponse {
  /** Preset name */
  args: [string];
}

export interface SetLightColorResponse extends SuccessResponse {
  /** RGB decimal value */
  args: [number, number, number];
}

export interface BeginSessionResponse extends SuccessResponse {
  /** Preset name */
  args: [string];
}

export interface ExitSessionResponse extends SuccessResponse {
  args: [true];
}

export interface EndSessionResponse extends SuccessResponse {
  args: [true];
}

export interface GetSessionStatusResponse extends SuccessResponse {
  /** If the argument is null then the server is not in "session mode". See the manual for further details. */
  args: [
    null | {
      /** Current state */
      state: 'running' | 'exiting' | 'stopped';
      /** Preset name */
      type: string;
    }
  ];
}

export interface Buster {
  /** Device ID */
  who: string;
  /** Assigned name */
  name: string;
  /** @example 'Line judge' */
  type: string;
}

export interface ReloadSpeedRoundResponse extends SuccessResponse {
  args: [
    {
      configuration: {
        countdown: number;
        bust: number;
        entry_fault: number;
        skip: number;
        page_count: number;
        moves_per_page: number;
        type: 'speed';
      };
      status: {
        current_buster: null | Buster;
        bust_count: number;
        skip_count: number;
        entry_fault: boolean;
      };
    }
  ];
}

export interface BustEnterResponse extends SuccessResponse {
  /** The current round status (with the caller as the current buster) */
  args: [
    {
      current_buster: Buster;
      bust_count: number;
      skip_count: number;
      entry_fault: boolean;
      exit_last: number;
    }
  ];
}

export interface BustLeaveResponse extends SuccessResponse {
  /** The current round status */
  args: [
    {
      current_buster: null;
      bust_count: number;
      skip_count: number;
      entry_fault: boolean;
      exit_last: number;
    }
  ];
}

export interface StopSpeedRoundResponse extends SuccessResponse {
  /** Round data */
  args: [
    {
      configuration: {
        countdown: number;
        bust: number;
        entry_fault: number;
        skip: number;
        page_count: number;
        moves_per_page: number;
        type: string;
      };
      times: {
        begin: number;
        end: number;
        raw_original: number;
        raw_final: number;
      };
      /** @todo Docs in manual missing */
      moves: any[];
      busts: {
        buster: Buster;
        begin: number;
        end: number;
      }[];
      /** @todo Docs in manual missing */
      maybusts: any[];
      /** @todo Docs in manual missing */
      skips: any[];
      /** @todo Docs in manual missing */
      exits: any[];
      has_entry_fault: boolean;
      metas: {
        created: number;
        activated: number;
        stopped: number;
      };
      id: number;
    }
  ];
}

interface NetworkSuccess extends AxiosResponse {
  data: null;
  status: 200;
}

interface NetworkFailure extends AxiosResponse {
  data: {
    code: 400;
    details: string;
    status: 'error';
    title: 'Invalid data';
    type: 'api.network';
  };
  status: number;
}

/**
 * This class contains methods for each API endpoint.
 * Refer to the offical manuals for details.
 * @see https://www.dynamr.com/en/tech/_bottom/dynamr_user_guide.pdf
 * @see https://www.dynamr.com/en/tech/_bottom/dynamr_api_doc.pdf
 */
export class DynamR {
  protocol: 'http' | 'https';
  hostname: string;
  port: string;

  constructor(options?: DynamROptions) {
    this.protocol = options?.protocol ?? 'http';
    this.hostname = options?.hostname ?? 'dynamr.local';
    this.port = options?.port ?? '8080';
  }

  private _createRequest(method: string, endpoint: string, data: string) {
    return axios({
      method,
      baseURL: `${this.protocol}://${this.hostname}:${this.port}`,
      url: endpoint,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async _send<T extends SuccessResponse>(
    data: Payload
  ): Promise<T | FailureResponse> {
    const res = await this._createRequest(
      'post',
      '/call',
      JSON.stringify(data)
    );

    return res.data;
  }

  /** Gets the current presets. */
  getPresets() {
    return this._send<GetPresetsResponse>({
      procedure: 'com.dynamr.light_preset.all',
    });
  }

  /** Gets the current ligth status. */
  getLightStatus() {
    return this._send<GetLightStatusResponse>({
      procedure: 'com.dynamr.output.light.status',
    });
  }

  /** Sets the lights using a preset. */
  setLightPreset(presetName: string) {
    return this._send<SetLightPresetResponse>({
      procedure: 'com.dynamr.light.preset',
      args: [presetName],
    });
  }

  /** Sets all the lights to a custom color.
   * @example setLightColor('#123456')
   */
  setLightColor(colorHex: string) {
    return this._send<SetLightColorResponse>({
      procedure: 'com.dynamr.light.color',
      args: [colorHex],
    });
  }

  /** Starts a session using the given preset. */
  beginSession(presetName: string) {
    return this._send<BeginSessionResponse>({
      procedure: 'com.dynamr.session.begin',
      args: [presetName],
    });
  }

  /** Exits the current session.
   * See the manual for the difference between session exit and session end.
   */
  exitSession() {
    return this._send<ExitSessionResponse>({
      procedure: 'com.dynamr.session.exit',
    });
  }

  /** Ends the current session.
   * See the manual for the difference between session exit and session end.
   */
  endSession() {
    return this._send<EndSessionResponse>({
      procedure: 'com.dynamr.session.end',
    });
  }

  /** Gets the current session status. */
  getSessionStatus() {
    return this._send<GetSessionStatusResponse>({
      procedure: 'com.dynamr.session.status',
    });
  }

  /** Force-reloads the current round. */
  reloadSpeedRound() {
    return this._send<ReloadSpeedRoundResponse>({
      procedure: 'com.dynamr.round_speed.reload',
    });
  }

  /** @todo Find docs for this endpoint. */
  bustEnter() {
    return this._send<BustEnterResponse>({
      procedure: 'com.dynamr.round_speed.bust_enter',
    });
  }

  /** @todo Find docs for this endpoint. */
  bustLeave() {
    return this._send<BustLeaveResponse>({
      procedure: 'com.dynamr.round_speed.bust_leave',
    });
  }

  /** Stops the current speed round. */
  stopSpeedRound() {
    return this._send<StopSpeedRoundResponse>({
      procedure: 'com.dynamr.round_speed.stop',
    });
  }

  /** Sets the ODE (Open DMX Ethernet) endpoint */
  setODE(ip: string): Promise<NetworkSuccess | NetworkFailure> {
    return this._createRequest('post', '/api/network/ode', ip);
  }

  /** Configures the eth0 interface */
  setETH0(
    dhcp: false,
    address: string,
    netmask: string
  ): Promise<NetworkSuccess | NetworkFailure>;
  setETH0(dhcp: true): Promise<NetworkSuccess | NetworkFailure>;
  setETH0(
    dhcp: boolean,
    address?: string,
    netmask?: string
  ): Promise<NetworkSuccess | NetworkFailure> {
    return this._createRequest(
      'post',
      '/api/network/eth0',
      JSON.stringify({
        dhcp,
        address,
        netmask,
      })
    );
  }
}
