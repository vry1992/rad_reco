import type { FC, PropsWithChildren } from 'react';

type Props = {
  label: string;
} & PropsWithChildren;

export const InputWrapper: FC<Props> = ({ label, children }: Props) => {
  return (
    <div className="floating-container">
      {children}
      <label>{label}</label>
    </div>
  );
};
