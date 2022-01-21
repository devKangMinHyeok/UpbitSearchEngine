import ReactSwitch from "react-switch";

interface CustomSwitchProps {
  checked: boolean;
  onChange: any;
}

function CustomSwitch({ checked, onChange }: CustomSwitchProps) {
  return (
    <ReactSwitch
      onChange={onChange}
      checked={checked}
      uncheckedIcon={false}
      checkedIcon={false}
      width={40}
      height={20}
      handleDiameter={14}
    />
  );
}

export default CustomSwitch;
