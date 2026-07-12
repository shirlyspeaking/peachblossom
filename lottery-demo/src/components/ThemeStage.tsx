import { BlindBoxTheme } from './themes/BlindBoxTheme';
import { ClawTheme } from './themes/ClawTheme';
import { LotTheme } from './themes/LotTheme';
import { PetalTheme } from './themes/PetalTheme';
import { WheelTheme } from './themes/WheelTheme';
import type { ThemeViewProps, UiTheme } from '../lib/types';

type Props = ThemeViewProps & { theme: UiTheme };

export function ThemeStage({ theme, ...props }: Props) {
  switch (theme) {
    case 'claw':
      return <ClawTheme {...props} />;
    case 'lot':
      return <LotTheme {...props} />;
    case 'petal':
      return <PetalTheme {...props} />;
    case 'blindbox':
      return <BlindBoxTheme {...props} />;
    case 'wheel':
    default:
      return <WheelTheme {...props} />;
  }
}
