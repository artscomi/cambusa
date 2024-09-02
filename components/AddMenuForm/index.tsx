import { useAddMealInputConfig } from "@/hooks/useAddMealInputConfig";
import { TextInput } from "../MealPlanner/TextInput";
import { CtaAddMenu } from "../CTA/CtaAddMenu";

export const AddMenu = () => {
  const { inputConfig, formState } = useAddMealInputConfig();
  return (
    <div className="bg-white p-10 rounded-lg">
      <p className="text-lg font-bold mb-8">Aggiungi un pasto</p>
      {inputConfig.map((config) => (
        <TextInput key={config.id} {...config} />
      ))}
      <CtaAddMenu
        formData={formState}
      />
    </div>
  );
};
