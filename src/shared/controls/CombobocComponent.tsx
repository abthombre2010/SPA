import * as React from 'react';
import { ComboBox, IComboBox, IComboBoxOption } from '@fluentui/react';
import { useEffect } from 'react';

interface IcomboboxProps{
    options:any;
    selectedKey:any;
    onSelectedOptionChange:any;
    disabled:any;
    className?:any;
}


export const ComboboxComponent: React.FunctionComponent<IcomboboxProps> = ({options,selectedKey,disabled,onSelectedOptionChange,className}) => {
  
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  const onChange = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string,
  ): void => {
    const selected = option?.selected;
    const currentSelectedOptionKeys = selectedKeys.filter(key => key !== 'selectAll');

    if (option) {
        const updatedKeys = selected
          ? [...currentSelectedOptionKeys, option!.key as string]
          : currentSelectedOptionKeys.filter(k => k !== option.key);
        
        setSelectedKeys(updatedKeys);
        onSelectedOptionChange(updatedKeys);
    }
  };

   useEffect(() => {
    if(selectedKey!=null){
        setSelectedKeys(selectedKey);
    }
   },[selectedKey])

  return (
      <ComboBox className={className} multiSelect options={options} selectedKey={selectedKeys} disabled={disabled} onChange={onChange} />
  );
};
