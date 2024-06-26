import {LitElement, html, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import compentStyle from './azimuth-thruster-labeled.css?inline';
import {CommandStatus} from '../badge-command/badge-command';
import {classMap} from 'lit/directives/class-map.js';
import '../badge-command/badge-command';
import '../instrument-field/instrument-field';
import '../azimuth-thruster/azimuth-thruster';
import {InstrumentFieldSize} from '../instrument-field/instrument-field';
import {InstrumentState, Size} from '../types';
import {ifDefined} from 'lit/directives/if-defined.js';

export enum AzimuthThrusterLabeledSize {
  medium = 'medium',
  large = 'large',
}

@customElement('obc-azimuth-thruster-labeled')
export class ObcAzimuthThrusterLabeled extends LitElement {
  @property({type: String}) label = '';
  @property({type: String, attribute: 'command-status'})
  commandStatus: CommandStatus = CommandStatus.InCommand;
  @property({type: String}) size: AzimuthThrusterLabeledSize =
    AzimuthThrusterLabeledSize.medium;
  @property({type: Number}) angle = 0;
  @property({type: Number, attribute: 'angle-setpoint'}) angleSetpoint:
    | number
    | undefined;
  @property({type: Boolean, attribute: 'at-angle-setpoint'})
  atAngleSetpoint: boolean = false;

  @property({type: Number}) thrust = 0;
  @property({type: Number, attribute: 'thrust-setpoint'}) thrustSetpoint:
    | number
    | undefined;
  @property({type: Boolean, attribute: 'at-thrust-setpoint'})
  atThrustSetpoint: boolean = false;
  @property({type: Boolean, attribute: 'thrust-setpoint-at-zero'})
  thrustSetpointAtZero: boolean = false;

  override render() {
    const fieldSize =
      this.size === AzimuthThrusterLabeledSize.large
        ? InstrumentFieldSize.large
        : InstrumentFieldSize.regular;
    const azimuthSize =
      this.size === AzimuthThrusterLabeledSize.large ? Size.large : Size.medium;
    let state: InstrumentState = InstrumentState.inCommand;
    if (
      [
        CommandStatus.NoCommand,
        CommandStatus.Blocked,
        CommandStatus.CommandAvailable,
      ].includes(this.commandStatus)
    ) {
      state = InstrumentState.active;
    }

    return html`
      <div class=${classMap({wrapper: true, [this.size]: true})}>
        <div class="label">
          <obc-badge-command
            class="badge"
            status=${this.commandStatus}
            ?large=${this.size === AzimuthThrusterLabeledSize.large}
          ></obc-badge-command>
          <div class="label-text">${this.label}</div>
        </div>
        <obc-instrument-field
          class="instrument-field-angle"
          value=${this.angle}
          setpoint=${ifDefined(this.angleSetpoint)}
          tag="Angle"
          unit=""
          degree
          has-setpoint
          size=${fieldSize}
        ></obc-instrument-field>
        <obc-instrument-field
          class="instrument-field-power"
          value=${this.thrust}
          setpoint=${ifDefined(this.thrustSetpoint)}
          tag="Power"
          unit="%"
          has-setpoint
          size=${fieldSize}
        ></obc-instrument-field>
        <obc-azimuth-thruster
          class="azimuth-thruster"
          no-padding
          .size=${azimuthSize}
          .thrust=${this.thrust}
          .thrustSetpoint=${this.thrustSetpoint}
          .angle=${this.angle}
          .angleSetpoint=${this.angleSetpoint}
          .atThrustSetpoint=${this.atThrustSetpoint}
          .atAngleSetpoint=${this.atAngleSetpoint}
          .state=${state}
        ></obc-azimuth-thruster>
      </div>
    `;
  }

  static override styles = unsafeCSS(compentStyle);
}

declare global {
  interface HTMLElementTagNameMap {
    'obc-azimuth-thruster-labeled': ObcAzimuthThrusterLabeled;
  }
}
