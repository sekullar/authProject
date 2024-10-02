import {Accordion, AccordionItem} from "@nextui-org/accordion";

const SSS = ({ userInfoRole }) => {
    return(
        <>
        <Accordion className="flex flex-col gap-4 mt-12">
            <AccordionItem className="border-semiblack-special cursor-pointer p-4  rounded-lg" title={<div className="inter-600"> <span>Benim rolüm ne?</span></div>}>
                <p>Senin rolün şu anda, {userInfoRole} olarak gözüküyor.</p>
            </AccordionItem>
            <AccordionItem className="border-semiblack-special cursor-pointer p-4  rounded-lg" title={<div className="inter-600"> <span>Member (üye) rolü neler yapabilir?</span></div>}>
                <p>Bir şeyler ekleyemez,silemez veya düzenleyemez. Sadece okuma izni vardır. Sadece paylaşımlardan yararlanabilir.</p>
            </AccordionItem>
            <AccordionItem className="border-semiblack-special cursor-pointer p-4  rounded-lg" title={<div className="inter-600"> <span>Rol sistemi ne işe yarıyor?</span></div>}>
                <p>Kişilerin rol sistemi sayesinde erişebileceği sekmeler belirleniyor. Örneğin X sınıfının içerikleri sitede mevcut olmasına rağmen X sınıfından olmayan birisi bunu göremez.</p>
            </AccordionItem>
            <AccordionItem className="border-semiblack-special cursor-pointer p-4  rounded-lg" title={<div className="inter-600"> <span>Rol yükseltmesi/değişimi talep etmek istiyorum.</span></div>}>
                <p>En aşağıdan rol yükseltmesi/değişikliği talep edebilir veya hesap ayarlarından talep edebilirsin.</p>
            </AccordionItem>
            <AccordionItem className="border-semiblack-special cursor-pointer p-4  rounded-lg" title={<div className="inter-600"> <span>Sol sekmede hiç bir sekme gözükmüyor.</span></div>}>
                <p>İlk önce internet bağlantılarını kontrol et, bunun haricinde sitede yasaklanmış olabilirsin.</p>
            </AccordionItem>
            <AccordionItem className="border-semiblack-special cursor-pointer p-4  rounded-lg" title={<div className="inter-600"> <span>Kim bizi nasıl yasaklayabiliyor?</span></div>}>
                <p>Belirli rollere göre, bu roller sizi sistemden yasaklayabilir.</p>
            </AccordionItem>
            <AccordionItem className="border-semiblack-special cursor-pointer p-4  rounded-lg" title={<div className="inter-600"> <span>Araçlar (XTools) ne işe yarar?</span></div>}>
                <p>Genel ihtiyaçların bir sitede toplanıp bir eko sistem yaratılmasını hedefledik. XTools'lar bu yüzden var.</p>
            </AccordionItem>
        </Accordion>
        </>
    )
}

export default SSS 