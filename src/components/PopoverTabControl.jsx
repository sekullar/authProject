import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";

export default function App() {
  return (
    <Popover 
      showArrow
      backdrop="opaque"
      placement="right"
      classNames={{
        base: [  
          // arrow color
          "before:bg-default-200"
        ],
        content: [
          "py-3 px-4",
          "rounded-lg",
          "dark:from-default-100 dark:to-default-50",
        ],
      }}
    >
      <PopoverTrigger>
        <Button className="bg-yellow-500 text-yellow-100 px-4 py-2 rounded-lg">!</Button>
      </PopoverTrigger>
      <PopoverContent className="bg-yellow-500">
        {(titleProps) => (
          <div className="px-1 py-2">
            <h3 className="text-small text-white font-bold" {...titleProps}>
              Lütfen dikkat!
            </h3>
            <div className="text-tiny w-[200px] text-sm text-white">Eklediğiniz roller sistemdekiler ile birebir uyuşmaz ise roller düzgünce göremez. Girdiğiniz rol isimlerinin büyük küçük harf kuralı dahil birebir aynı olması gerekmektedir.</div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}