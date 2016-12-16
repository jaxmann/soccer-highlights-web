package hello;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VerifyController {

	private final AtomicLong counter = new AtomicLong();

	@RequestMapping("/verify")
	public String greeting(@RequestParam("data", defaultValue="World") String name) {
		return "result is " + name;
	}



}