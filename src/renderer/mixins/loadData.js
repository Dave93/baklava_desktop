import {mapGetters, mapActions} from "vuex";
import ProductItems from '@/store/models/items'
import settings from "electron-settings";

export default {
    methods: {
        ...mapActions({
            setCartItems: "setCartItems",
            setCategories: "setCategories",
        }),
        async loadData() {
            const webHook = await settings.get('webHook')
            const managerData = await settings.get('managerData')

            let { data: categoriesData } = await this.$http.get(
                `${webHook}mycatalog.section.list`
            );
            await this.setCategories({
                val: categoriesData.result.map((item) => ({
                    id: item.ID,
                    name: item.NAME,
                })),
            });


            let {data: productsData} = await this.$http.get(
                `${webHook}mycatalog.product.list?managerId=${managerData.ID}`
            );
            await ProductItems.insert({
                data: productsData.result.map((item) => ({
                    id: item.ID,
                    name: item.ELEMENT_NAME,
                    barcode: item.BARCODE_BARCODE,
                    customCode: item.CUSTOM_CODE,
                    selected: false,
                    categoryId: item.ELEMENT_IBLOCK_SECTION_ID,
                    image: item.PREVIEW_PICTURE,
                    price: item.BASE_PRICE,
                    type: item.type,
                    totalAmountCount: item.TOTAL_AMOUNT_COUNT,
                    childs: item.childs,
                }))
            });
            await this.setCartItems({
                val: []
            });
        }
    }
}