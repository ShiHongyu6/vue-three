namespace ButtonGroup {
  interface ButtonOption {
    display: string;
    onChange?: () => void;
    onClick?:() => void
  }

  interface Props {
    hidden: boolean;
    buttonsOption: ButtonsOption[];
    selected: number;
  }
}